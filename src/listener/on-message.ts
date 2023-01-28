import {
	createBookmarkAction,
	createHistoryAction,
} from "../actions/create-action";
import { Action } from "../actions/data/types-data";
import { createBookmark, removeBookmark } from "../chrome/bookmarks";
import {
	clearAllData,
	clearBrowsingData,
	clearCookies,
	clearCache,
	clearLocalStorage,
	clearPasswords,
} from "../chrome/clear";
import {
	switchTab,
	goBack,
	goForward,
	duplicateTab,
	muteTab,
	reloadTab,
	pinTab,
	openChromeUrl,
	closeCurrentTab,
	closeTab,
	restoreNewTab,
	getCurrentTab,
} from "../chrome/tab";
import { openIncognito, closeWindow } from "../chrome/window";

export function attachOnMessageListener(resetExtension: () => Action[]) {
	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		switch (message.request) {
			case "get-actions":
				const actions = resetExtension();
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
						data.forEach((ele, _index) => {
							actions.push(createHistoryAction(ele));
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
							actions.push(createBookmarkAction(action));
						});
					data.forEach((action, index) => {
						if (!action.url) {
							data.splice(index, 1);
						}
						actions.push({
							title: action.title,
							type: "bookmark",
							emojiChar: "⭐️",
							action: "bookmark",
							url: action.url,
							description: action.url,
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
				restoreNewTab("");
				break;
			case "close-scanny":
				getCurrentTab().then((response) => {
					chrome.tabs.sendMessage(response.id, { request: "close-scanny" });
				});
				break;
		}
	});
}

