import $ from "jquery";
import { Action } from "../actions/data/types-data";
import { findClickableElements } from "../interactive/search-element";

export function handleHistory(
	query: string,
	setActions: React.Dispatch<React.SetStateAction<Action[]>>
) {
	var tempvalue = query.replace("/history ", "");
	chrome.runtime.sendMessage(
		{ request: "search-history", query: tempvalue },
		(response) => {
			setActions(response.history);
		}
	);
}

export function handleBookmarks(
	query: string,
	setActions: React.Dispatch<React.SetStateAction<Action[]>>
) {
	var tempvalue = query.replace("/bookmarks ", "");
	if (tempvalue !== "") {
		chrome.runtime.sendMessage(
			{ request: "search-bookmarks", query: tempvalue },
			(response) => {
				setActions(response.bookmarks);
			}
		);
	}
}

export function handleInteractive(query: string) {
	return findClickableElements(query.replace(">", ""));
}

// TODO: Fix this
export function handleTabs(query: string, actions: Action[]) {
	var tempvalue = query.replace("/tabs ", "");
	if (tempvalue === "/tabs") {
		return actions.filter((x) => x.type == "tab");
	} else {
		tempvalue = query.replace("/tabs ", "");
		return actions.filter(
			(x) =>
				x.title.toLowerCase().indexOf(query) > -1 ||
				x.description.toLowerCase().indexOf(query) > -1
		);
	}
}

export function handleAction(query: string, actions: Action[]) {
	var tempvalue = query.replace("/actions ", "");
	if (tempvalue == "/actions") {
		return actions.filter((x) => x.type == "action");
	} else {
		tempvalue = query.replace("/actions ", "");
		return actions.filter(
			(x) =>
				x.title.toLowerCase().indexOf(query) > -1 ||
				x.description.toLowerCase().indexOf(query) > -1
		);
	}
}
