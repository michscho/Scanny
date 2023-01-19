import { resetBasicActions } from "../actions/create-action";
import { Action, searchActionData } from "../actions/actions-data";
import { getBookmarks } from "../chrome/bookmarks";
import { getTabs } from "../chrome/tab";
import $ from "jquery";
import focusLock from "dom-focus-lock";
import { App } from "../components/app";
import React from "react";
import * as ReactDOM from "react-dom/client";

export const resetAllActions = () => [
	...searchActionData,
	...resetBasicActions(),
	...getTabs(),
	...getBookmarks(),
];

export function closeOmni(isOpen: boolean): boolean {
	if (
		window.location.href ===
		"chrome-extension://mpanekjjajcabgnlbabmopeenljeoggm/newtab.html"
	) {
		chrome.runtime.sendMessage({ request: "restore-new-tab" });
	} else {
		$("#omni-extension").addClass("omni-closing");
		return false;
	}
	return isOpen;
}

export function openOmni(root, isOpen: boolean, actions: Action[]): boolean {
	isOpen = true;
	chrome.runtime.sendMessage({ request: "get-actions" }, (response) => {
		actions = response.actions;
		const reactRoot = ReactDOM.createRoot(root);
		reactRoot.render(<App actions={actions} />);
		window.setTimeout(() => {
			$("#omni-extension input").focus();
			focusLock.on($("#omni-extension input").get(0));
			$("#omni-extension input").focus();
		}, 100);
	});
	return isOpen;
}
