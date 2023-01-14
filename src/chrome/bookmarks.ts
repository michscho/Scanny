import { getCurrentTab } from "./tab";

// Get bookmarks to populate in the actions
export const getBookmarks = (actions) => {
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

export const createBookmark = (tab) => {
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
