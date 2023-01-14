import { findClickableElementsText } from "../interactive/interactive";
import { populateOmni, populateOmniFilter } from "../omni/omni";
import { checkShortHand, validURL } from "../omni/utils";
import { Action } from "../actions/actions-data";
import { hideSearchAndGoToActions } from "../components/utils";
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

export function search(e, actions: Action[], isFiltered: boolean) {
	if (isSpecialKeyEvent(e)) {
		return;
	}
	var query = $(this).val().toString().toLowerCase();
	checkShortHand(e, query);
	query = $(this).val().toString().toLowerCase();

	if (query.startsWith("/history")) {
		handleHistory(query, actions, isFiltered);
		return;
	}

	if (query.startsWith("/bookmarks")) {
		handleBookmarks(query, actions, isFiltered);
		return;
	}

	if (query.startsWith("/interactive")) {
		handleInteractive(query, actions, isFiltered);
		return;
	}

	if (isFiltered) {
		populateOmni(actions);
		isFiltered = false;
	}

	$(".omni-extension #omni-list .omni-item").map(function () {
		if (query.startsWith("/tabs")) {
			handleTabs(query, actions);
		}

		if (query.startsWith("/remove")) {
			handleRemove(query, actions);
		}

		if (query.startsWith("/actions")) {
			handleAction(query, actions);
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

		if (!validURL(query)) {
			handleInvalidURL(query, actions);
			return;
		}

		handleValidURL(query, actions);
	});

	$(".omni-extension #omni-results").html(
		$("#omni-extension #omni-list .omni-item:visible").length + " results"
	);
	$(".omni-item-active").removeClass("omni-item-active");
	$(".omni-extension #omni-list .omni-item:visible")
		.first()
		.addClass("omni-item-active");
}

function isSpecialKeyEvent(e) {
	return (
		e.keyCode == keyMapings.down ||
		e.keyCode == keyMapings.enter ||
		e.keyCode == keyMapings.left ||
		e.keyCode == keyMapings.right ||
		e.keyCode == keyMapings.up
	);
}
