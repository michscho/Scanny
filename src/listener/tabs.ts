import { Action } from "../actions/data/types-data";

type ResetActionFN = () => Action[];

export function attachChromeTabListener(resetAllActions: ResetActionFN) {
	chrome.tabs.onUpdated.addListener((_tabId, _changeInfo, _tab) =>
		resetAllActions()
	);

	chrome.tabs.onCreated.addListener((_tab) => resetAllActions());

	chrome.tabs.onRemoved.addListener((_tabId, _changeInfo) => resetAllActions());
}
