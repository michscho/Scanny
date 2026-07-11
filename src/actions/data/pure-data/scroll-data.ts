import { Action } from "../types-data";

export const scrollData: Action[] = [
	{
		title: "Scroll to bottom",
		description: "Scroll to the bottom of the page",
		type: "action",
		action: "scroll-bottom",
		emojiChar: "👇",
		keys: ["⌘", "↓"],
	},
	{
		title: "Scroll to top",
		description: "Scroll to the top of the page",
		type: "action",
		action: "scroll-top",
		emojiChar: "👆",
		keys: ["⌘", "↑"],
	},
	{
		title: "Auto-scroll page",
		description: "Slowly scroll down on its own — press any key or click to stop",
		type: "action",
		action: "auto-scroll",
		emojiChar: "🐌",
	},
];
