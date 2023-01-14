import { resetActions } from "./action-utils";
import { Action } from "./actions-data";
import { getBookmarks } from "./bookmarks";
import { getTabs } from "./tab";

export const resetOmni = (actions) => {
	resetActions();
	getTabs(actions);
	const bookmarkActions = getBookmarks(actions);
	var search: Action[] = [
		{
			title: "Search",
			desc: "Search for a query",
			type: "action",
			action: "search",
			emoji: true,
			emojiChar: "🔍",
			keycheck: false,
		},
		{
			title: "Search",
			desc: "Go to website",
			type: "action",
			action: "goto",
			emoji: true,
			emojiChar: "🔍",
			keycheck: false,
		},
	];
	actions = search.concat(actions).concat(bookmarkActions);
};
