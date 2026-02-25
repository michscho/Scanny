import { Action } from "./data/types-data";

export function createInteractiveAction(
	title: string,
	desc: string,
	emojiChar: string,
	id?: string
): Action {
	return {
		title: title,
		description: desc,
		type: "interactive",
		action: "web-element",
		emojiChar: emojiChar,
		id,
		url: desc,
	};
}

export function createBookmarkAction(
	bookmark: chrome.bookmarks.BookmarkTreeNode
): Action {
	return {
		title: bookmark.title,
		description: "Bookmark",
		id: bookmark.id,
		url: bookmark.url,
		type: "bookmark",
		action: "bookmark",
		emojiChar: "⭐️",
	};
}

export function createHistoryAction(
	history: chrome.history.HistoryItem
): Action {
	return {
		title: history.title || "",
		type: "history",
		emojiChar: "🏛",
		action: "history",
		url: history.url,
		description: history.url || "",
	};
}

export function createTabAction(tab: chrome.tabs.Tab): Action {
	return {
		title: tab.title || "",
		type: "tab",
		emojiChar: "📑",
		action: "switch-tab",
		url: tab.url,
		description: tab.url || "",
		tabId: tab.id,
		windowId: tab.windowId,
		tabIndex: tab.index,
	};
}
