import { getBookmarks } from "../chrome/bookmarks";
import { getTabs } from "../chrome/tab";
import { getActionsData } from "./data/get-actions-data";

export const resetAllActions = () => [
	...getActionsData(),
	// ...getTabs(),
	// ...getBookmarks(),
];

