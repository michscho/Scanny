import { Action } from "./actions-data";

export const getCurrentTab = async () => {
	const queryOptions = { active: true, currentWindow: true };
	const [tab] = await chrome.tabs.query(queryOptions);
	return tab;
};

export function restoreNewTab(newtaburl: string) {
	getCurrentTab().then((response) => {
		chrome.tabs
			.create({
				url: newtaburl,
			})
			.then(() => {
				chrome.tabs.remove(response.id!);
			});
	});
}

export const switchTab = (tab) => {
	chrome.tabs.highlight({
		tabs: tab.index,
		windowId: tab.windowId,
	});
	chrome.windows.update(tab.windowId, { focused: true });
};
export const goBack = (tab) => {
	chrome.tabs.goBack();
};
export const goForward = (tab) => {
	chrome.tabs.goForward();
};
export const duplicateTab = (tab) => {
	getCurrentTab().then((response) => {
		chrome.tabs.duplicate(response.id);
	});
};

export const muteTab = (mute) => {
	getCurrentTab().then((response) => {
		chrome.tabs.update(response.id, { muted: mute });
	});
};
export const reloadTab = () => {
	chrome.tabs.reload();
};
export const pinTab = (pin) => {
	getCurrentTab().then((response) => {
		chrome.tabs.update(response.id, { pinned: pin });
	});
};

export const getTabs = (actions: Action[]) => {
	chrome.tabs.query({}, (tabs) => {
		tabs.forEach((tab) => {
			actions.push({
				title: tab.title,
				desc: "Chrome tab",
				keycheck: false,
				action: "switch-tab",
				type: "tab",
				emoji: false,
			});
		});
	});
	return actions;
};