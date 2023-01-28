import $ from "jquery";
import { Action } from "../actions/data/types-data";
import { findClickableElements } from "../interactive/search";

// export function handleHistory(query: string, actions: Action[]) {
// 	var tempvalue = query.replace("/history ", "");
// 	if (tempvalue != "/history") {
// 		query = query.replace("/history ", "");
// 	}
// 	chrome.runtime.sendMessage(
// 		{ request: "search-history", query: query },
// 		(response) => {
// 			setActions(response.historyAction);
// 		}
// 	);
// }

// export function handleBookmarks(
// 	query: string,
// 	actions: Action[],
// 	setActionFunction: React.Dispatch<React.SetStateAction<Action[]>>
// ) {
// 	var tempvalue = query.replace("/bookmarks ", "");
// 	if (tempvalue != "/bookmarks" && tempvalue != "") {
// 		var query = query.replace("/bookmarks ", "");
// 		chrome.runtime.sendMessage(
// 			{ request: "search-bookmarks", query: query },
// 			(response) => {
// 				setActionFunction(response.bookmarkAction);
// 			}
// 		);
// 	} else {
// 		setActionFunction(actions.filter((x) => x.type == "bookmark"));
// 	}
// }

export function handleInteractive(query: string) {
	return findClickableElements(query.replace(">", ""));
}

export function handleTabs(query: string, actions: Action[]) {
	var tempvalue = query.replace("/tabs ", "");
	if (tempvalue == "/tabs") {
		$(this).toggle($(this).attr("data-type") == "tab");
	} else {
		tempvalue = query.replace("/tabs ", "");
		$(this).toggle(
			($(this)
				.find(".scanny-item-name")
				.text()
				.toLowerCase()
				.indexOf(tempvalue) > -1 ||
				$(this)
					.find(".scanny-item-desc")
					.text()
					.toLowerCase()
					.indexOf(tempvalue) > -1) &&
				$(this).attr("data-type") == "tab"
		);
	}
}

export function handleRemove(query: string, actions: Action[]) {
	var tempvalue = query.replace("/remove ", "");
	if (tempvalue == "/remove") {
		$(this).toggle(
			$(this).attr("data-type") == "bookmark" ||
				$(this).attr("data-type") == "tab"
		);
	} else {
		tempvalue = query.replace("/remove ", "");
		$(this).toggle(
			($(this)
				.find(".scanny-item-name")
				.text()
				.toLowerCase()
				.indexOf(tempvalue) > -1 ||
				$(this)
					.find(".scanny-item-desc")
					.text()
					.toLowerCase()
					.indexOf(tempvalue) > -1) &&
				($(this).attr("data-type") == "bookmark" ||
					$(this).attr("data-type") == "tab")
		);
	}
}

export function handleAction(query: string, actions: Action[]) {
	var tempvalue = query.replace("/actions ", "");
	if (tempvalue == "/actions") {
		$(this).toggle($(this).attr("data-type") == "action");
	} else {
		tempvalue = query.replace("/actions ", "");
		$(this).toggle(
			($(this)
				.find(".scanny-item-name")
				.text()
				.toLowerCase()
				.indexOf(tempvalue) > -1 ||
				$(this)
					.find(".scanny-item-desc")
					.text()
					.toLowerCase()
					.indexOf(tempvalue) > -1) &&
				$(this).attr("data-type") == "action"
		);
	}
}
