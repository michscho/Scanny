import $ from "jquery";
import { Action } from "../actions/data/types-data";
import { findClickableElements } from "../interactive/search";

export function handleHistory(query: string) {
	var tempvalue = query.replace("/history ", "");
	if (tempvalue != "/history") {
		query = query.replace("/history ", "");
	}
	const historyActions: Action[] = [];
	chrome.runtime.sendMessage(
		{ request: "search-history", query: query },
		(response) => {
			historyActions.push(...response.historyAction);
		}
	);
	return historyActions;
}

export function handleBookmarks(
	query: string
) {
	var tempvalue = query.replace("/bookmarks ", "");
	const bookmarkActions: Action[] = [];
	if (tempvalue !== "/bookmarks" && tempvalue !== "") {
		var query = query.replace("/bookmarks ", "");
		chrome.runtime.sendMessage(
			{ request: "search-bookmarks", query: query },
			(response) => {
				bookmarkActions.push(...response.bookmarkAction);
			}
		);
	} else {
		bookmarkActions.push(...bookmarkActions.filter((x) => x.type == "bookmark"));
	}
	return bookmarkActions;
}

export function handleInteractive(query: string) {
	return findClickableElements(query.replace(">", ""));
}

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
