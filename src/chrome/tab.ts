import { createTabAction } from "../actions/create-action";
import { Action } from "../actions/data/types-data";

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

export const switchTab = (tab: {
	tabId?: number;
	windowId?: number;
	tabIndex?: number;
}) => {
	if (tab.tabId !== undefined) {
		chrome.tabs.update(tab.tabId, { active: true });
		if (tab.windowId !== undefined) {
			chrome.windows.update(tab.windowId, { focused: true });
		}
		return;
	}

	if (tab.windowId !== undefined && tab.tabIndex !== undefined) {
		chrome.tabs.highlight({
			tabs: tab.tabIndex,
			windowId: tab.windowId,
		});
		chrome.windows.update(tab.windowId, { focused: true });
	}
};

export const goBack = (tab: chrome.tabs.Tab) => {
	chrome.tabs.goBack();
};

export const goForward = (tab: chrome.tabs.Tab) => {
	chrome.tabs.goForward();
};

export const duplicateTab = (tab: chrome.tabs.Tab) => {
	getCurrentTab().then((response) => {
		chrome.tabs.duplicate(response.id!);
	});
};

export const muteTab = (mute: boolean) => {
	getCurrentTab().then((response) => {
		chrome.tabs.update(response.id!, { muted: mute });
	});
};

export const reloadTab = () => {
	chrome.tabs.reload();
};

export const pinTab = (pin: boolean) => {
	getCurrentTab().then((response) => {
		chrome.tabs.update(response.id!, { pinned: pin });
	});
};

export const getTabs = async (): Promise<Action[]> => {
	const tabs = await chrome.tabs.query({});
	return tabs.map((tab) => createTabAction(tab));
};

export const openChromeUrl = (url: string) => {
	chrome.tabs.create({ url: "chrome://" + url + "/" });
};

export const closeTab = (tab: chrome.tabs.Tab) => {
	chrome.tabs.remove(tab.id!);
};

export const closeCurrentTab = () => {
	getCurrentTab().then(closeTab);
};
