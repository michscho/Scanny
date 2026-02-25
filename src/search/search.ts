import { checkShortHand } from "../extension/utils";
import {
	handleBookmarks,
	handleHistory,
	handleInteractive,
} from "./handle-search";
import { filterSearchAndGoItems } from "../utils/utils";
import { resetActions } from "../actions/reset-actions";
import { Action } from "../actions/data/types-data";

export function search(
	event: React.KeyboardEvent<HTMLInputElement>,
	actions: Action[],
	setActions: React.Dispatch<React.SetStateAction<Action[]>>
) {
	if (isSpecialKeyEvent(event)) {
		return;
	}

	actions = resetActions();

	const query = event.currentTarget.value.toString().toLowerCase();
	checkShortHand(event, query);

	if (query.startsWith("/history")) {
		handleHistory(query, setActions);
		return;
	}

	if (query.startsWith("/bookmarks")) {
		handleBookmarks(query, setActions);
		return;
	}

	if (query.startsWith(">")) {
		setActions(handleInteractive(event.currentTarget.value));
		return;
	}

	if (query.startsWith("/tabs")) {
		// handleTabs(query, setActions);
		// return;
	}

	// if (query.startsWith("/actions")) {
	// 	return handleAction(query, actions);
	// }

	if (query === "") {
		const allActions = filterSearchAndGoItems(actions);
		setActions(allActions);
		return;
	}

	const filteredActions = actions.filter(
		(x) =>
			x.title.toLowerCase().indexOf(query) > -1 ||
			x.description.toLowerCase().indexOf(query) > -1
	);

	setActions(filteredActions);
}

function isSpecialKeyEvent(e: React.KeyboardEvent<HTMLInputElement>) {
	return (
		e.key === "ArrowDown" ||
		e.key === "Enter" ||
		e.key === "ArrowLeft" ||
		e.key === "ArrowRight" ||
		e.key === "ArrowUp"
	);
}
