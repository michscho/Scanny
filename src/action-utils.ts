import { Action, actionData } from "./actions-data";
import { getCurrentTab } from "./tab";

export function remapKeys(actions: Action[]) {
	for (const action of actions) {
		switch (action.action) {
			case "reload":
				action.keys = ["F5"];
				break;
			case "fullscreen":
				action.keys = ["F11"];
				break;
			case "downloads":
				action.keys = ["Ctrl", "J"];
				break;
			case "settings":
				action.keycheck = false;
				break;
			case "history":
				action.keys = ["Ctrl", "H"];
				break;
			case "go-back":
				action.keys = ["Alt", "←"];
				break;
			case "go-forward":
				action.keys = ["Alt", "→"];
				break;
			case "scroll-top":
				action.keys = ["Home"];
				break;
			case "scroll-bottom":
				action.keys = ["End"];
				break;
		}
		for (const key in action.keys) {
			if (action.keys[key] === "⌘") {
				action.keys[key] = "Ctrl";
			} else if (action.keys[key] === "⌥") {
				action.keys[key] = "Alt";
			}
		}
	}
}

export const resetActions = () => {
	getCurrentTab().then((response) => {
		var actions = [];
		const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
		let muteaction: Action = {
			title: "Mute tab",
			desc: "Mute the current tab",
			type: "action",
			action: "mute",
			emoji: true,
			emojiChar: "🔇",
			keycheck: true,
			keys: ["⌥", "⇧", "M"],
		};
		let pinaction: Action = {
			title: "Pin tab",
			desc: "Pin the current tab",
			type: "action",
			action: "pin",
			emoji: true,
			emojiChar: "📌",
			keycheck: true,
			keys: ["⌥", "⇧", "P"],
		};
		if (response.mutedInfo!.muted) {
			muteaction = {
				title: "Unmute tab",
				desc: "Unmute the current tab",
				type: "action",
				action: "unmute",
				emoji: true,
				emojiChar: "🔈",
				keycheck: true,
				keys: ["⌥", "⇧", "M"],
			};
		}
		if (response.pinned) {
			pinaction = {
				title: "Unpin tab",
				desc: "Unpin the current tab",
				type: "action",
				action: "unpin",
				emoji: true,
				emojiChar: "📌",
				keycheck: true,
				keys: ["⌥", "⇧", "P"],
			};
		}
		actions = actionData.concat([muteaction, pinaction]);

		if (!isMac) {
			remapKeys(actions);
		}
	});
};
