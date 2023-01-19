import { checkShortHand, validURL } from "../extension/utils";
import { Action } from "../actions/actions-data";
import $ from "jquery";
import { keyMapings } from "../utils/key-mappings";
import {
	handleAction,
	handleBookmarks,
	handleHistory,
	handleInteractive,
	handleInvalidURL,
	handleRemove,
	handleTabs,
	handleValidURL,
} from "./handle-search";
import { hideSearchAndGoToActions } from "../utils/utils";
import { resetBasicActions } from "../actions/reset-actions";

export function search(
	e: JQuery.KeyUpEvent<Document, undefined, any, any>,
	actions: Action[],
	setActionFunction: React.Dispatch<React.SetStateAction<Action[]>>
) {
	if (isSpecialKeyEvent(e)) {
		return;
	}

	resetBasicActions();

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

	$(".omni-extension #omni-list .omni-item").map(function () {
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
			setActionFunction(actions);
			hideSearchAndGoToActions(actions);
			return;
		}

		const filteredActions = actions.filter(
			(x) =>
				x.title.toLowerCase().indexOf(query) > -1 ||
				x.desc.toLowerCase().indexOf(query) > -1
		);

		setActionFunction(filteredActions);

		if (validURL(query)) {
			handleValidURL(query, actions);
			return;
		}

		handleInvalidURL(query, actions);
	});

	showNumberOfResults();
}

function showNumberOfResults() {
	$(".omni-extension #omni-results").html(
		$("#omni-extension #omni-list .omni-item:visible").length + " results"
	);
	$(".omni-item-active").removeClass("omni-item-active");
	$(".omni-extension #omni-list .omni-item:visible")
		.first()
		.addClass("omni-item-active");
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
