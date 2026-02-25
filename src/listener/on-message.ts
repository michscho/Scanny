import {
	createBookmarkAction,
	createHistoryAction,
	createTabAction,
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
				break;
			case "history":
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
				closeWindow(sender.tab!.windowId);
				break;
			case "close-tab":
				closeCurrentTab();
				break;
			case "search-history":
				chrome.history
					.search({ text: message.query, maxResults: 50, startTime: 0 })
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
					const actions: Action[] = data
						.filter((bookmark) => bookmark.url)
						.map((bookmark) => createBookmarkAction(bookmark));
					sendResponse({ bookmarks: actions });
				});
				return true;
			case "search-tabs":
				chrome.tabs.query({}).then((tabs) => {
					const query = String(message.query || "").toLowerCase().trim();
					const filteredTabs = tabs.filter((tab) => {
						if (!query) return true;
						const title = (tab.title || "").toLowerCase();
						const url = (tab.url || "").toLowerCase();
						return title.includes(query) || url.includes(query);
					});
					sendResponse({
						tabs: filteredTabs.map((tab) => createTabAction(tab)),
					});
				});
				return true;
			case "ask-ai":
				chrome.storage.sync.get({ openAIApiKey: "" }, async (result) => {
					const apiKey = String(result.openAIApiKey || "").trim();
					const prompt = String(message.query || "").trim();
					if (!apiKey) {
						sendResponse({ error: "missing-key" });
						return;
					}
					if (!prompt) {
						sendResponse({ error: "empty-prompt" });
						return;
					}

					try {
						const aiResponse = await fetch(
							"https://api.openai.com/v1/chat/completions",
							{
								method: "POST",
								headers: {
									Authorization: `Bearer ${apiKey}`,
									"Content-Type": "application/json",
								},
								body: JSON.stringify({
									model: "gpt-4o-mini",
									messages: [{ role: "user", content: prompt }],
									temperature: 0.4,
									max_tokens: 280,
								}),
							}
						);

						if (!aiResponse.ok) {
							sendResponse({ error: `api-error-${aiResponse.status}` });
							return;
						}

						const data = (await aiResponse.json()) as {
							choices?: Array<{ message?: { content?: string } }>;
						};
						const answer =
							typeof data.choices?.[0]?.message?.content === "string"
								? data.choices[0].message.content.trim()
								: "";

						if (!answer) {
							sendResponse({ error: "empty-answer" });
							return;
						}

						sendResponse({ answer });
					} catch {
						sendResponse({ error: "network-error" });
					}
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
					chrome.tabs.sendMessage(response.id!, { request: "close-scanny" });
				});
				break;
			case "open-scanny-settings":
				chrome.runtime.openOptionsPage();
				break;
		}
	});
}
