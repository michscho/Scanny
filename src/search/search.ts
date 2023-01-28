import { checkShortHand } from "../extension/utils";
import { keyMapings } from "../utils/key-mappings";
import {
	handleAction,
	handleInteractive,
	handleRemove,
	handleTabs,
} from "./handle-search";
import { filterSearchAndGoItems } from "../utils/utils";
import { resetActions } from "../actions/reset-actions";
import { Action } from "../actions/data/types-data";

export function search(
	event: React.KeyboardEvent<HTMLInputElement>,
	actions: Action[]
): Action[] {
	if (isSpecialKeyEvent(event)) {
		return;
	}

	actions = resetActions();

	const query = event.currentTarget.value.toString().toLowerCase();
	checkShortHand(event, query);

	// if (query.startsWith("/history")) {
	// 	return handleHistory(query, actions);
	// }

	// if (query.startsWith("/bookmarks")) {
	// 	return handleBookmarks(query, actions);
	// }

	if (query.startsWith(">")) {
		return handleInteractive(event.currentTarget.value);
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
		return allActions;
	}

	const filteredActions = actions.filter(
		(x) =>
			x.title.toLowerCase().indexOf(query) > -1 ||
			x.description.toLowerCase().indexOf(query) > -1
	);

	return filteredActions;
}

function isSpecialKeyEvent(e: React.KeyboardEvent<HTMLInputElement>) {
	return (
		e.keyCode == keyMapings.down ||
		e.keyCode == keyMapings.enter ||
		e.keyCode == keyMapings.left ||
		e.keyCode == keyMapings.right ||
		e.keyCode == keyMapings.up
	);
}
