import { checkShortHand, validURL } from "../extension/utils";
import $ from "jquery";
import { keyMapings } from "../utils/key-mappings";
import {
	handleAction,
	handleBookmarks,
	handleHistory,
	handleInteractive,
	handleRemove,
	handleTabs,
} from "./handle-search";
import { filterSearchAndGoItems } from "../utils/utils";
import { resetAllActions } from "../actions/reset-actions";
import { Action } from "../actions/data/types-data";

export function search(
	e: JQuery.KeyUpEvent<Document, undefined, any, any>,
	actions: Action[],
	setActionFunction: React.Dispatch<React.SetStateAction<Action[]>>
) {
	if (isSpecialKeyEvent(e)) {
		return;
	}

	resetAllActions();

	var query = $(e.target).val().toString().toLowerCase();
	checkShortHand(e, query);
	query = $(e.target).val().toString().toLowerCase();

	if (query.startsWith("/history")) {
		handleHistory(query, actions, setActionFunction);
		return;
	}

	if (query.startsWith("/bookmarks")) {
		handleBookmarks(query, actions, setActionFunction);
		return;
	}

	if (query.startsWith("/interactive")) {
		handleInteractive($(e.target).val().toString(), actions, setActionFunction);
		return;
	}

	if (query.startsWith("/tabs")) {
		handleTabs(query, actions);
		return;
	}

	if (query.startsWith("/remove")) {
		handleRemove(query, actions);
		return;
	}

	if (query.startsWith("/actions")) {
		handleAction(query, actions);
		return;
	}

	if (query === "") {
		const allActions = filterSearchAndGoItems(actions);
		setActionFunction(allActions);
		displayNumberOfActions(allActions);
		return;
	}

	const filteredActions = actions.filter(
		(x) =>
			x.title.toLowerCase().indexOf(query) > -1 ||
			x.description.toLowerCase().indexOf(query) > -1
	);

	setActionFunction(filteredActions);

	displayNumberOfActions(filteredActions);
}

function displayNumberOfActions(actions: Action[]) {
	$(".omni-extension #omni-results").html(actions.length + " results");
}

function isSpecialKeyEvent(
	e: JQuery.KeyUpEvent<Document, undefined, any, any>
) {
	return (
		e.keyCode == keyMapings.down ||
		e.keyCode == keyMapings.enter ||
		e.keyCode == keyMapings.left ||
		e.keyCode == keyMapings.right ||
		e.keyCode == keyMapings.up
	);
}
