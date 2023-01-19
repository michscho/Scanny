import { Action } from "../types-data";

export const clearData: Action[] = [
	{
		title: "Clear browsing history",
		description: "Clear all of your browsing history",
		type: "action",
		action: "remove-history",
		emojiChar: "🗂",
		keys: ["⌘", "D"],
	},
	{
		title: "Clear cookies",
		description: "Clear all cookies",
		type: "action",
		action: "remove-cookies",
		emojiChar: "🍪",
		keys: ["⌘", "D"],
	},
	{
		title: "Clear cache",
		description: "Clear the cache",
		type: "action",
		action: "remove-cache",
		emojiChar: "🗄",
		keys: ["⌘", "D"],
	},
	{
		title: "Clear local storage",
		description: "Clear the local storage",
		type: "action",
		action: "remove-local-storage",
		emojiChar: "📦",
		keys: ["⌘", "D"],
	},
	{
		title: "Clear passwords",
		description: "Clear all saved passwords",
		type: "action",
		action: "remove-passwords",
		emojiChar: "🔑",
		keys: ["⌘", "D"],
	},
	{
		title: "Clear all browsing data",
		description: "Clear all of your browsing data",
		type: "action",
		action: "remove-all",
		emojiChar: "🧹",
		keys: ["⌘", "D"],
	},
];
