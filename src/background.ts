import { Action } from "./actions-data";
import { createBookmark, removeBookmark } from "./bookmarks";
import {
	clearAllData,
	clearBrowsingData,
	clearCookies,
	clearCache,
	clearLocalStorage,
	clearPasswords,
} from "./clear";
import { resetOmni } from "./omni";
import {
	duplicateTab,
	getCurrentTab,
	goBack,
	goForward,
	muteTab,
	pinTab,
	reloadTab,
	restoreNewTab,
	switchTab,
} from "./tab";

let actions: Action[] = [];
let newtaburl = "";

chrome.runtime.onInstalled.addListener((object) => {

	const manifest = chrome.runtime.getManifest();

	const injectIntoTab = (tab) => {
		const scripts = manifest.content_scripts![0].js;
		const s = scripts!.length;

		for (let i = 0; i < s; i++) {
			chrome.scripting.executeScript({
				target: { tabId: tab.id },
				files: [scripts![i]],
			});
		}

		chrome.scripting.insertCSS({
			target: { tabId: tab.id },
			files: [manifest.content_scripts![0].css![0]],
		});
	};

	// Get all windows
	chrome.windows.getAll(
		{
			populate: true,
		},
		(windows) => {
			let currentWindow;
			const w = windows.length;

			for (let i = 0; i < w; i++) {
				currentWindow = windows[i];

				let currentTab;
				const t = currentWindow.tabs.length;

				for (let j = 0; j < t; j++) {
					currentTab = currentWindow.tabs[j];
					if (
						!currentTab.url.includes("chrome://") &&
						!currentTab.url.includes("chrome-extension://") &&
						!currentTab.url.includes("chrome.google.com")
					) {
						injectIntoTab(currentTab);
					}
				}
			}
		}
	);

	if (object.reason === "install") {
		chrome.tabs.create({ url: "https://alyssax.com/omni/" });
	}
});

// Check when the extension button is clicked
chrome.action.onClicked.addListener((tab) => {
	chrome.tabs.sendMessage(tab.id!, { request: "open-omni" });
});

// Listen for the open omni shortcut
chrome.commands.onCommand.addListener((command) => {
	if (command === "open-omni") {
		getCurrentTab().then((response) => {
			if (
				!response.url!.includes("chrome://") &&
				!response.url!.includes("chrome.google.com")
			) {
				chrome.tabs.sendMessage(response.id!, { request: "open-omni" });
			} else {
				chrome.tabs
					.create({
						url: "./newtab.html",
					})
					.then(() => {
						newtaburl = response.url!;
						chrome.tabs.remove(response.id!);
					});
			}
		});
	}
});

// Check if tabs have changed and actions need to be fetched again
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>
	resetOmni(actions)
);
chrome.tabs.onCreated.addListener((tab) => resetOmni(actions));
chrome.tabs.onRemoved.addListener((tabId, changeInfo) => resetOmni(actions));

const openChromeUrl = (url) => {
	chrome.tabs.create({ url: "chrome://" + url + "/" });
};
const openIncognito = () => {
	chrome.windows.create({ incognito: true });
};
const closeWindow = (id) => {
	chrome.windows.remove(id);
};
const closeTab = (tab) => {
	chrome.tabs.remove(tab.id);
};
const closeCurrentTab = () => {
	getCurrentTab().then(closeTab);
};

// Receive messages from any tab
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	switch (message.request) {
		case "get-actions":
			resetOmni(actions);
			sendResponse({ actions: actions });
			break;
		case "switch-tab":
			switchTab(message.tab);
			break;
		case "go-back":
			goBack(message.tab);
			break;
		case "go-forward":
			goForward(message.tab);
			break;
		case "duplicate-tab":
			duplicateTab(message.tab);
			break;
		case "create-bookmark":
			createBookmark(message.tab);
			break;
		case "mute":
			muteTab(true);
			break;
		case "unmute":
			muteTab(false);
			break;
		case "reload":
			reloadTab();
			break;
		case "pin":
			pinTab(true);
			break;
		case "unpin":
			pinTab(false);
			break;
		case "remove-all":
			clearAllData();
			break;
		case "remove-history":
			clearBrowsingData();
			break;
		case "remove-cookies":
			clearCookies();
			break;
		case "remove-cache":
			clearCache();
			break;
		case "remove-local-storage":
			clearLocalStorage();
			break;
		case "remove-passwords":
			clearPasswords();
		case "history": // Fallthrough
		case "downloads":
		case "extensions":
		case "settings":
		case "extensions/shortcuts":
			openChromeUrl(message.request);
			break;
		case "manage-data":
			openChromeUrl("settings/clearBrowserData");
			break;
		case "incognito":
			openIncognito();
			break;
		case "close-window":
			closeWindow(sender.tab.windowId);
			break;
		case "close-tab":
			closeCurrentTab();
			break;
		case "search-history":
			chrome.history
				.search({ text: message.query, maxResults: 0, startTime: 0 })
				.then((data) => {
					var actions: Action[] = [];
					data.forEach((ele, index) => {
						actions.push({
							title: ele.title,
							type: "history",
							emoji: true,
							emojiChar: "🏛",
							action: "history",
							url: ele.url,
							desc: ele.url,
							keycheck: false,
						});
					});
					sendResponse({ history: actions });
				});
			return true;
		case "search-bookmarks":
			chrome.bookmarks.search({ query: message.query }).then((data) => {
				var actions: Action[] = [];
				data
					.filter((x) => x.index == 0)
					.forEach((action, index) => {
						if (!action.url) {
							data.splice(index, 1);
						}
						actions.push({
							title: action.title,
							type: "bookmark",
							emoji: true,
							emojiChar: "⭐️",
							action: "bookmark",
							url: action.url,
							desc: action.url,
							keycheck: false,
						});
					});
				data.forEach((action, index) => {
					if (!action.url) {
						data.splice(index, 1);
					}
					actions.push({
						title: action.title,
						type: "bookmark",
						emoji: true,
						emojiChar: "⭐️",
						action: "bookmark",
						url: action.url,
						desc: action.url,
						keycheck: false,
					});
				});
				sendResponse({ bookmarks: actions });
			});
			return true;
		case "remove":
			if (message.type == "bookmark") {
				removeBookmark(message.action);
			} else {
				closeTab(message.action);
			}
			break;
		case "search":
			chrome.search.query({ text: message.query }, () => {});
			break;
		case "restore-new-tab":
			restoreNewTab(newtaburl);
			break;
		case "close-omni":
			getCurrentTab().then((response) => {
				chrome.tabs.sendMessage(response.id, { request: "close-omni" });
			});
			break;
	}
});

// Get actions
resetOmni(actions);
