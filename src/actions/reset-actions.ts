import { getActionsData } from "./data/get-actions-data";

export const resetActions = () => [
	...getActionsData(),
	// ...getTabs(),
	// ...getBookmarks(),
];
