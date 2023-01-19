import $ from "jquery";
import jQuery from "jquery";
import { handleAction } from "./actions/handle-action";
import { closeOmni, openOmni } from "./omni/omni";
import { keyMapings } from "./utils/key-mappings";
import { Action } from "./actions/actions-data";
import { scrollDown, scrollUp } from "./omni/scrolling";

// A common need for extensions is to have a single long-running script to manage some task or
// state. Background pages to the rescue.The background page is an HTML page that runs in the
// extension process. It exists for the lifetime of your extension, and only one instance of it at a
// time is active.

var isOpen = false;

document.onkeyup = (e) => {
	if (e.key == "Escape" && isOpen) {
		chrome.runtime.sendMessage({ request: "close-omni" });
	}
};

jQuery(function () {
	var actions: Action[] = [];
	var isFiltered = false;

	$("#omni-extension-toast img").attr(
		"src",
		chrome.runtime.getURL("icons/check.svg")
	);

	chrome.runtime.sendMessage({ request: "get-actions" }, (response) => {
		actions = response.actions;
	});

	// TODO: Is this right?
	if (
		window.location.href ==
		"chrome-extension://mpanekjjajcabgnlbabmopeenljeoggm/newtab.html"
	) {
		isOpen = true;
		$("#omni-extension").removeClass("omni-closing");
		window.setTimeout(() => {
			$("#omni-extension input").focus();
		}, 100);
	}

	// Customize the shortcut to open the Omni box
	function openShortcuts() {
		chrome.runtime.sendMessage({ request: "extensions/shortcuts" });
	}

	// Check which keys are down
	var down = [];

	$(document)
		.keydown((e) => {
			down[e.keyCode] = true;
			if (down[keyMapings.up]) {
				scrollUp();
				return;
			}
			if (down[keyMapings.down]) {
				scrollDown();
				return;
			}
			if (down[keyMapings.enter] && isOpen) {
				// TODO: 
				//isOpen = handleAction(e, actions, isOpen);
				return;
			}
			if (down[keyMapings.esc] && isOpen) {
				isOpen = closeOmni(isOpen);
				return;
			}
		})
		.keyup((e) => {
			if (
				down[keyMapings.alt] &&
				down[keyMapings.shift] &&
				down[keyMapings.x]
			) {
				if (actions.find((x) => x.action == "pin") != undefined) {
					chrome.runtime.sendMessage({ request: "pin-tab" });
				} else {
					chrome.runtime.sendMessage({ request: "unpin-tab" });
				}
				chrome.runtime.sendMessage({ request: "get-actions" }, (response) => {
					actions = response.actions;
					rerenderActionsList(actions);
				});
			} else if (
				down[keyMapings.alt] &&
				down[keyMapings.shift] &&
				down[keyMapings.m]
			) {
				if (actions.find((x) => x.action == "mute") != undefined) {
					chrome.runtime.sendMessage({ request: "mute-tab" });
				} else {
					chrome.runtime.sendMessage({ request: "unmute-tab" });
				}
				chrome.runtime.sendMessage({ request: "get-actions" }, (response) => {
					actions = response.actions;
					rerenderActionsList(actions);
				});
			} else if (
				down[keyMapings.alt] &&
				down[keyMapings.shift] &&
				down[keyMapings.c]
			) {
				window.open("mailto:");
			}

			down = [];
		});

	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		if (message.request == "open-omni") {
			if (isOpen) {
				isOpen = closeOmni(isOpen);
			} else {
				const extensionRoot = document.createElement("div");
				extensionRoot.id = "omni-extension";
				extensionRoot.className = "omni-extension";
				document.body.appendChild(extensionRoot);
				isOpen = openOmni(extensionRoot, isOpen, actions);
			}
		} else if (message.request == "close-omni") {
			isOpen = closeOmni(isOpen);
		}
	});

	$(document).on("click", "#open-page-omni-extension-thing", openShortcuts);

	$(document).on("click", ".omni-extension #omni-overlay", () =>
		closeOmni(isOpen)
	);
});
