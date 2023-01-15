import { Action } from "../actions/actions-data";
import $ from "jquery";

export function hideSearchAndGoToActions(actions: Action[]) {
	$(
		".omni-item[data-index='" +
			actions.findIndex((x: Action) => x.action == "search") +
			"']"
	).hide();
	$(
		".omni-item[data-index='" +
			actions.findIndex((x: Action) => x.action == "goto") +
			"']"
	).hide();
}
