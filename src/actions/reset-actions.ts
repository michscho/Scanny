import { getBookmarks } from "../chrome/bookmarks";
import { getTabs } from "../chrome/tab";
import { getActionsData } from "./data/get-actions-data";

export const resetActions = () => [
	...getActionsData(),
	// ...getTabs(),
	// ...getBookmarks(),
];

