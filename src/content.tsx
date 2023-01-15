import $ from "jquery";
import jQuery from "jquery";
import { handleAction } from "./actions/handle-action";
import {
	closeOmni,
	openOmni,
	populateOmni as populateActions,
} from "./omni/omni";
import { hoverItem } from "./omni/utils";
import { keyMapings } from "./search/key-mappings";
import { search } from "./search/search";
import * as ReactDOM from "react-dom/client";
import React from "react";
import { App } from "./app";

var isOpen = false;

document.onkeyup = (e) => {
	if (e.key == "Escape" && isOpen) {
		chrome.runtime.sendMessage({ request: "close-omni" });
	}
};

jQuery(function () {
	var actions = [];
	var isFiltered = false;

	const extensionRoot = document.createElement("div");
	extensionRoot.id = "omni-extension";
	extensionRoot.className = "omni-extension";
	document.body.appendChild(extensionRoot);
	const reactRoot = ReactDOM.createRoot(extensionRoot);
	reactRoot.render(<App />);

	// Get checkmark image for toast
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
				if (
					$(".omni-item-active").prevAll("div").not(":hidden").first().length
				) {
					var previous = $(".omni-item-active")
						.prevAll("div")
						.not(":hidden")
						.first();
					$(".omni-item-active").removeClass("omni-item-active");
					previous.addClass("omni-item-active");
					previous[0].scrollIntoView({ block: "nearest", inline: "nearest" });
				}
			} else if (down[keyMapings.down]) {
				if (
					$(".omni-item-active").nextAll("div").not(":hidden").first().length
				) {
					var next = $(".omni-item-active")
						.nextAll("div")
						.not(":hidden")
						.first();
					$(".omni-item-active").removeClass("omni-item-active");
					next.addClass("omni-item-active");
					next[0].scrollIntoView({ block: "nearest", inline: "nearest" });
				}
			} else if (down[keyMapings.esc] && isOpen) {
				// Esc key
				isOpen = closeOmni(isOpen);
			} else if (down[keyMapings.enter] && isOpen) {
				// Enter key
				isOpen = handleAction(e, actions, isOpen);
			}
		})
		.keyup((e) => {
			if (down[18] && down[16] && down[80]) {
				if (actions.find((x) => x.action == "pin") != undefined) {
					chrome.runtime.sendMessage({ request: "pin-tab" });
				} else {
					chrome.runtime.sendMessage({ request: "unpin-tab" });
				}
				chrome.runtime.sendMessage({ request: "get-actions" }, (response) => {
					actions = response.actions;
					populateActions(actions);
				});
			} else if (down[18] && down[16] && down[77]) {
				if (actions.find((x) => x.action == "mute") != undefined) {
					chrome.runtime.sendMessage({ request: "mute-tab" });
				} else {
					chrome.runtime.sendMessage({ request: "unmute-tab" });
				}
				chrome.runtime.sendMessage({ request: "get-actions" }, (response) => {
					actions = response.actions;
					populateActions(actions);
				});
			} else if (down[18] && down[16] && down[67]) {
				window.open("mailto:");
			}

			down = [];
		});

	// Recieve messages from background
	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		if (message.request == "open-omni") {
			if (isOpen) {
				isOpen = closeOmni(isOpen);
			} else {
				isOpen = openOmni(isOpen, actions);
			}
		} else if (message.request == "close-omni") {
			isOpen = closeOmni(isOpen);
		}
	});

	$(document).on("click", "#open-page-omni-extension-thing", openShortcuts);
	$(document).on(
		"mouseover",
		".omni-extension .omni-item:not(.omni-item-active)",
		hoverItem
	);
	$(document).on("keyup", ".omni-extension input", (e) =>
		search(e, actions, isFiltered)
	);
	$(document).on("click", ".omni-item-active", handleAction);
	// TODO: look into this issue
	//$(document).on("click", ".omni-extension #omni-overlay", closeOmni);
});
