import { createBookmarkAction } from "../actions/create-action";
import { Action } from "../actions/data/types-data";
import { getCurrentTab } from "./tab";

type Bookmark = chrome.bookmarks.BookmarkTreeNode;
type Tab = chrome.tabs.Tab;

export const getBookmarks = () => {
	const actions: Action[] = [];
	const process_bookmark = (bookmarks: Bookmark[]) => {
		for (const bookmark of bookmarks) {
			if (bookmark.url) {
				const bookmarkAction = createBookmarkAction(bookmark);
				actions.push(bookmarkAction);
			}
			if (bookmark.children) {
				process_bookmark(bookmark.children);
			}
		}
	};

	chrome.bookmarks.getRecent(100, process_bookmark);
	return actions;
};

export const createBookmark = (_tab: Tab) => {
	getCurrentTab().then((response) => {
		chrome.bookmarks.create({
			title: response.title,
			url: response.url,
		});
	});
};

export const removeBookmark = (bookmark: Bookmark) => {
	chrome.bookmarks.remove(bookmark.id);
};
