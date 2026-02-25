import focusLock from "dom-focus-lock";
import { App } from "../components/app";
import * as ReactDOM from "react-dom/client";
import { Action } from "../actions/data/types-data";

const ROOT_ID = "scanny-extension-root";
let extensionContainer: HTMLDivElement | null = null;
let extensionRoot: ReactDOM.Root | null = null;
let isOpening = false;

function focusSearchInput() {
	const input = document.querySelector<HTMLInputElement>("#scanny-extension input");
	if (!input) {
		return;
	}
	input.focus();
	focusLock.on(input);
	input.focus();
}

export function closeExtension() {
	const input = document.querySelector<HTMLInputElement>("#scanny-extension input");
	if (input) {
		focusLock.off(input);
	}
	if (!extensionContainer || !extensionRoot) {
		return;
	}
	extensionRoot.unmount();
	extensionContainer.remove();
	extensionContainer = null;
	extensionRoot = null;
}

export function openExtension(actions: Action[]) {
	if (extensionContainer || isOpening) {
		focusSearchInput();
		return;
	}

	const existingRoot = document.getElementById(ROOT_ID) as HTMLDivElement | null;
	if (existingRoot) {
		extensionContainer = existingRoot;
		focusSearchInput();
		return;
	}

	isOpening = true;
	const root = document.createElement("div");
	root.id = ROOT_ID;
	document.body.appendChild(root);

	chrome.runtime.sendMessage({ request: "get-actions" }, (response) => {
		if (chrome.runtime.lastError) {
			console.error("Scanny: failed to get actions", chrome.runtime.lastError.message);
		}
		actions = response?.actions ?? actions;
		extensionContainer = root;
		extensionRoot = ReactDOM.createRoot(root);
		extensionRoot.render(<App actions={actions} onClose={closeExtension} />);
		isOpening = false;
		window.setTimeout(focusSearchInput, 100);
	});
}
