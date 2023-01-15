import { rerenderActionsList } from "../omni/omni";
import { checkShortHand, validURL } from "../omni/utils";
import { Action } from "../actions/actions-data";
import $ from "jquery";
import { keyMapings } from "./key-mappings";
import {
	handleAction,
	handleBookmarks,
	handleEmptyQuery,
	handleHistory,
	handleInteractive,
	handleInvalidURL,
	handleRemove,
	handleTabs,
	handleValidURL,
} from "./handle-search";

export function search(
	e: JQuery.KeyUpEvent<Document, undefined, any, any>,
	actions: Action[],
	isFiltered: boolean
) {
	console.log(e);

	if (isSpecialKeyEvent(e)) {
		return;
	}
	var query = $(e.target).val().toString().toLowerCase();
	checkShortHand(e, query);
	query = $(e.target).val().toString().toLowerCase();

	console.log(query);

	if (query.startsWith("/history")) {
		handleHistory(query, actions, isFiltered);
		return;
	}

	if (query.startsWith("/bookmarks")) {
		handleBookmarks(query, actions, isFiltered);
		return;
	}

	if (query.startsWith("/interactive")) {
		handleInteractive($(e.target).val().toString(), actions, isFiltered);
		return;
	}

	if (isFiltered) {
		rerenderActionsList(actions);
		isFiltered = false;
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

		$(this).toggle(
			$(this).find(".omni-item-name").text().toLowerCase().indexOf(query) >
				-1 ||
				$(this).find(".omni-item-desc").text().toLowerCase().indexOf(query) > -1
		);

		if (query === "") {
			handleEmptyQuery(actions);
			return;
		}

		if (validURL(query)) {
			handleValidURL(query, actions);
			return;
		}

		handleInvalidURL(query, actions);
	});

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

