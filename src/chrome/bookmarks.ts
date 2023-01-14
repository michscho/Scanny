import { Action } from "../actions/actions-data";
import { getCurrentTab } from "./tab";

export const getBookmarks = () => {
	const actions: Action[] = [];
	const process_bookmark = (bookmarks) => {
		for (const bookmark of bookmarks) {
			if (bookmark.url) {
				actions.push({
					title: bookmark.title,
					desc: "Bookmark",
					id: bookmark.id,
					url: bookmark.url,
					type: "bookmark",
					action: "bookmark",
					emoji: true,
					emojiChar: "⭐️",
					keycheck: false,
				});
			}
			if (bookmark.children) {
				process_bookmark(bookmark.children);
			}
		}
	};

	chrome.bookmarks.getRecent(100, process_bookmark);
	return actions;
};

export const createBookmark = (tab: chrome.tabs.Tab) => {
	getCurrentTab().then((response) => {
		chrome.bookmarks.create({
			title: response.title,
			url: response.url,
		});
	});
};

export const removeBookmark = (bookmark) => {
	chrome.bookmarks.remove(bookmark.id);
};
