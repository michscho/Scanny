import { Action } from "./actions-data";

export function createAction(
	title: string,
	desc: string,
	emojiChar: string
): Action {
	return {
		title: title,
		desc: desc,
		type: "interactive",
		action: "web-element",
		emoji: true,
		emojiChar: emojiChar,
		url: desc,
		keycheck: false,
	};
}

export function createBookmarkAction(
	bookmark: chrome.bookmarks.BookmarkTreeNode
): Action {
	return {
		title: bookmark.title,
		desc: "Bookmark",
		id: bookmark.id,
		url: bookmark.url,
		type: "bookmark",
		action: "bookmark",
		emoji: true,
		emojiChar: "⭐️",
		keycheck: false,
	};
}
