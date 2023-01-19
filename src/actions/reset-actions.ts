import { getBookmarks } from "../chrome/bookmarks";
import { getTabs } from "../chrome/tab";
import { searchActionData, Action, actionData } from "./actions-data";

export const resetAllActions = () => [
	...searchActionData,
	...resetBasicActions(),
	...getTabs(),
	...getBookmarks(),
];

export function resetBasicActions(): Action[] {
	var actions = [];

	actions = actionData;

	if (!isMac()) {
		reconfigureKeys(actions);
	}

	return actions;
}

function isMac() {
	return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
}

function reconfigureKeys(actions: Action[]) {
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
