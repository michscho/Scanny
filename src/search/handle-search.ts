import $ from "jquery";
import { Action } from "../actions/actions-data";
import { findClickableElements } from "../interactive/search";
import { hideSearchAndGoToActions } from "../utils/utils";

export function handleHistory(
	query: string,
	actions: Action[],
	setActionFunction: React.Dispatch<React.SetStateAction<Action[]>>
) {
	hideSearchAndGoToActions(actions);
	var tempvalue = query.replace("/history ", "");
	if (tempvalue != "/history") {
		query = query.replace("/history ", "");
	}
	chrome.runtime.sendMessage(
		{ request: "search-history", query: query },
		(response) => {
			setActionFunction(response.history);
		}
	);
}

export function handleBookmarks(
	query: string,
	actions: Action[],
	setActionFunction: React.Dispatch<React.SetStateAction<Action[]>>
) {
	hideSearchAndGoToActions(actions);
	var tempvalue = query.replace("/bookmarks ", "");
	if (tempvalue != "/bookmarks" && tempvalue != "") {
		var query = query.replace("/bookmarks ", "");
		chrome.runtime.sendMessage(
			{ request: "search-bookmarks", query: query },
			(response) => {
				setActionFunction(response.bookmarkAction);
			}
		);
	} else {
		setActionFunction(actions.filter((x) => x.type == "bookmark"));
	}
}

export function handleInteractive(
	query: string,
	actions: Action[],
	setActionFunction: React.Dispatch<React.SetStateAction<Action[]>>
) {
	hideSearchAndGoToActions(actions);
	var tempvalue = query.replace("/interactive ", "");
	if (tempvalue != "/interactive") {
		const newActions: Action[] = findClickableElements(
			query.replace("/interactive ", "")
		);
		setActionFunction(newActions);
	} else {
		setActionFunction(actions.filter((x) => x.type === "interactive"));
	}
}

export function handleTabs(query: string, actions: Action[]) {
	hideSearchAndGoToActions(actions);
	var tempvalue = query.replace("/tabs ", "");
	if (tempvalue == "/tabs") {
		$(this).toggle($(this).attr("data-type") == "tab");
	} else {
		tempvalue = query.replace("/tabs ", "");
		$(this).toggle(
			($(this).find(".omni-item-name").text().toLowerCase().indexOf(tempvalue) >
				-1 ||
				$(this)
					.find(".omni-item-desc")
					.text()
					.toLowerCase()
					.indexOf(tempvalue) > -1) &&
				$(this).attr("data-type") == "tab"
		);
	}
}

export function handleRemove(query: string, actions: Action[]) {
	hideSearchAndGoToActions(actions);
	var tempvalue = query.replace("/remove ", "");
	if (tempvalue == "/remove") {
		$(this).toggle(
			$(this).attr("data-type") == "bookmark" ||
				$(this).attr("data-type") == "tab"
		);
	} else {
		tempvalue = query.replace("/remove ", "");
		$(this).toggle(
			($(this).find(".omni-item-name").text().toLowerCase().indexOf(tempvalue) >
				-1 ||
				$(this)
					.find(".omni-item-desc")
					.text()
					.toLowerCase()
					.indexOf(tempvalue) > -1) &&
				($(this).attr("data-type") == "bookmark" ||
					$(this).attr("data-type") == "tab")
		);
	}
}

export function handleAction(query: string, actions: Action[]) {
	hideSearchAndGoToActions(actions);
	var tempvalue = query.replace("/actions ", "");
	if (tempvalue == "/actions") {
		$(this).toggle($(this).attr("data-type") == "action");
	} else {
		tempvalue = query.replace("/actions ", "");
		$(this).toggle(
			($(this).find(".omni-item-name").text().toLowerCase().indexOf(tempvalue) >
				-1 ||
				$(this)
					.find(".omni-item-desc")
					.text()
					.toLowerCase()
					.indexOf(tempvalue) > -1) &&
				$(this).attr("data-type") == "action"
		);
	}
}

export function handleInvalidURL(query: string, actions: Action[]) {
	$(
		".omni-item[data-index='" +
			actions.findIndex((x) => x.action == "search") +
			"']"
	).hide();
	$(
		".omni-item[data-index='" +
			actions.findIndex((x) => x.action == "goto") +
			"']"
	).show();
	$(
		".omni-item[data-index='" +
			actions.findIndex((x) => x.action == "goto") +
			"'] .omni-item-name"
	).html('"' + query + '"');
}

export function handleValidURL(query: string, actions: Action[]) {
	{
		$(
			".omni-item[data-index='" +
				actions.findIndex((x) => x.action == "search") +
				"']"
		).hide();
		$(
			".omni-item[data-index='" +
				actions.findIndex((x) => x.action == "goto") +
				"']"
		).show();
		$(
			".omni-item[data-index='" +
				actions.findIndex((x) => x.action == "goto") +
				"'] .omni-item-name"
		).html(query);
	}
}
