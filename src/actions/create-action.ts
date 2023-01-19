import { Action } from "./data/types-data";

export function createInteractiveAction(
	title: string,
	desc: string,
	emojiChar: string
): Action {
	return {
		title: title,
		description: desc,
		type: "interactive",
		action: "web-element",
		emojiChar: emojiChar,
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
