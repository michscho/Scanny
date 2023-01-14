export function hideSearchAndGoToActions(actions) {
	$(
		".omni-item[data-index='" +
			actions.findIndex((x) => x.action == "search") +
			"']"
	).hide();
	$(
		".omni-item[data-index='" +
			actions.findIndex((x) => x.action == "goto") +
			"']"
	).hide();
}
