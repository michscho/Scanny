import { Action, actionData } from "./actions-data";

export function resetBasicActions(): Action[] {
	var actions = [];

	// TODO: make currentTap working
	// getCurrentTab().then((response) => {
	// 	let muteaction: Action = muteActionData;
	// 	let pinaction: Action = pinActionData;
	// 	if (response.mutedInfo!.muted) {
	// 		muteaction = unmuteActionData;
	// 	}
	// 	if (response.pinned) {
	// 		pinaction = unpinActionData;
	// 	}
	// 	actions = [actionData, muteaction, pinaction];
	// });

	actions = actionData;

	if (!isMac()) {
		remapKeys(actions);
	}

	return actions;
}

export function createAction(
	title: string,
	desc: string,
	emojiChar: string
): Action {
	return {
		title: title,
		desc: desc,
		type: "interactive",
		action: "web-element",
		emoji: true,
		emojiChar: emojiChar,
		url: desc,
		keycheck: false,
	};
}

export function createBookmarkAction(
	bookmark: chrome.bookmarks.BookmarkTreeNode
): Action {
	return {
		title: bookmark.title,
		desc: "Bookmark",
		id: bookmark.id,
		url: bookmark.url,
		type: "bookmark",
		action: "bookmark",
		emoji: true,
		emojiChar: "⭐️",
		keycheck: false,
	};
}

function remapKeys(actions: Action[]) {
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

function isMac() {
	return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
}
