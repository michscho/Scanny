import { Action } from "../types-data";

export const helpData: Action[] = [
	{
		title: "Search page elements",
		description: "Type > followed by text to find and click buttons, links, and inputs",
		type: "action",
		action: "none",
		emojiChar: "🔍",
	},
	{
		title: "Search browsing history",
		description: "Type /history followed by a search term",
		type: "action",
		action: "none",
		emojiChar: "🗂",
	},
	{
		title: "Search bookmarks",
		description: "Type /bookmarks followed by a search term",
		type: "action",
		action: "none",
		emojiChar: "⭐️",
	},
	{
		title: "Remove items",
		description: "Type /remove to delete bookmarks or history entries",
		type: "action",
		action: "none",
		emojiChar: "🗑",
	},
	{
		title: "Open Scanny",
		description: "Press Ctrl+Shift+K (Cmd+Shift+K on Mac) or click the extension icon",
		type: "action",
		action: "none",
		emojiChar: "⌨️",
	},
	{
		title: "Navigate results",
		description: "Use ↑ ↓ arrow keys to navigate, Enter to select, Escape to close",
		type: "action",
		action: "none",
		emojiChar: "🧭",
	},
	{
		title: "Open in new tab",
		description: "Hold Ctrl/Cmd while pressing Enter to open links in a new tab",
		type: "action",
		action: "none",
		emojiChar: "📑",
	},
	{
		title: "Scanny Settings",
		description: "Open Scanny settings to adjust transparency and more",
		type: "action",
		action: "open-scanny-settings",
		emojiChar: "⚙️",
	},
];
