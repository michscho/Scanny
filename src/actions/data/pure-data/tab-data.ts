import { Action } from "../types-data";

export const tabData: Action[] = [
	{
		title: "Duplicate tab",
		description: "Make a copy of the current tab",
		type: "action",
		action: "duplicate-tab",
		emojiChar: "📋",
		keys: ["⌥", "⇧", "D"],
	},
	{
		title: "Close tab",
		description: "Close the current tab",
		type: "action",
		action: "close-tab",
		emojiChar: "🗑",
		keys: ["⌘", "W"],
	},
];
