import $ from "jquery";
import focusLock from "dom-focus-lock";
import { App } from "../components/app";
import React from "react";
import * as ReactDOM from "react-dom/client";
import { Action } from "../actions/data/types-data";

export function openExtension(root: HTMLDivElement, actions: Action[]) {
	chrome.runtime.sendMessage({ request: "get-actions" }, (response) => {
		actions = response.actions;
		const reactRoot = ReactDOM.createRoot(root);
		reactRoot.render(<App actions={actions} />);
		window.setTimeout(() => {
			$("#omni-extension input").trigger("focus");
			focusLock.on($("#omni-extension input").get(0));
			$("#omni-extension input").trigger("focus");
		}, 100);
	});
}
