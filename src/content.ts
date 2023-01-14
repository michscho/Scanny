import $ from "jquery";
import {
	clickElement,
	findClickableElementsText,
} from "./interactive/interactive";
import {
	closeOmni,
	openOmni,
	populateOmni as populateActions,
	populateOmniFilter,
} from "./omni/omni";
import {
	checkShortHand,
	showToast,
	hoverItem,
	addhttp,
	validURL,
} from "./omni/utils";
import { search } from "./search/search";

var isOpen = false;

document.onkeyup = (e) => {
	if (e.key == "Escape" && isOpen) {
		chrome.runtime.sendMessage({ request: "close-omni" });
	}
};

// TODO: use new jQuery function
$(document).ready(() => {
	var actions = [];
	var isFiltered = false;

	// Append the omni into the current page
	$.get(chrome.runtime.getURL("/content.html"), (data) => {
		$(data).appendTo("body");

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
	});

	function handleAction(e) {
		var action = actions[$(".omni-item-active").attr("data-index")];
		closeOmni(isOpen);
		if (
			$(".omni-extension input")
				.val()
				.toString()
				.toLowerCase()
				.startsWith("/remove")
		) {
			chrome.runtime.sendMessage({
				request: "remove",
				type: action.type,
				action: action,
			});
		} else if (
			$(".omni-extension input")
				.val()
				.toString()
				.toLowerCase()
				.startsWith("/history")
		) {
			if (e.ctrlKey || e.metaKey) {
				window.open($(".omni-item-active").attr("data-url"));
			} else {
				window.open($(".omni-item-active").attr("data-url"), "_self");
			}
		} else if (
			$(".omni-extension input")
				.val()
				.toString()
				.toLowerCase()
				.startsWith("/bookmarks")
		) {
			if (e.ctrlKey || e.metaKey) {
				window.open($(".omni-item-active").attr("data-url"));
			} else {
				window.open($(".omni-item-active").attr("data-url"), "_self");
			}
		} else if (
			$(".omni-extension input")
				.val()
				.toString()
				.toLowerCase()
				.startsWith("/interactive")
		) {
			const query = $(".omni-item-active .omni-item-name").text();
			console.log(query);
			clickElement(query);
		} else {
			chrome.runtime.sendMessage({
				request: action.action,
				tab: action,
				query: $(".omni-extension input").val(),
			});
			switch (action.action) {
				case "bookmark":
					if (e.ctrlKey || e.metaKey) {
						window.open(action.url);
					} else {
						window.open(action.url, "_self");
					}
					break;
				case "scroll-bottom":
					window.scrollTo(0, document.body.scrollHeight);
					showToast(action);
					break;
				case "scroll-top":
					window.scrollTo(0, 0);
					break;
				case "navigation":
					if (e.ctrlKey || e.metaKey) {
						window.open(action.url);
					} else {
						window.open(action.url, "_self");
					}
					break;
				case "fullscreen":
					var elem = document.documentElement;
					elem.requestFullscreen();
					break;
				case "new-tab":
					window.open("");
					break;
				case "email":
					window.open("mailto:");
					break;
				case "url":
					if (e.ctrlKey || e.metaKey) {
						window.open(action.url);
					} else {
						window.open(action.url, "_self");
					}
					break;
				case "goto":
					if (e.ctrlKey || e.metaKey) {
						window.open(addhttp($(".omni-extension input").val()));
					} else {
						window.open(addhttp($(".omni-extension input").val()), "_self");
					}
					break;
				case "print":
					window.print();
					break;
				case "remove-all":
				case "remove-history":
				case "remove-cookies":
				case "remove-cache":
				case "remove-local-storage":
				case "remove-passwords":
					showToast(action);
					break;
			}
		}

		// Fetch actions again
		chrome.runtime.sendMessage({ request: "get-actions" }, (response) => {
			actions = response.actions;
			populateActions(actions);
		});
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
			if (down[38]) {
				// Up key
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
			} else if (down[40]) {
				// Down key
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
			} else if (down[27] && isOpen) {
				// Esc key
				closeOmni(isOpen);
			} else if (down[13] && isOpen) {
				// Enter key
				handleAction(e);
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
				closeOmni(isOpen);
			} else {
				openOmni(isOpen, actions);
			}
		} else if (message.request == "close-omni") {
			closeOmni(isOpen);
		}
	});

	$(document).on("click", "#open-page-omni-extension-thing", openShortcuts);
	$(document).on(
		"mouseover",
		".omni-extension .omni-item:not(.omni-item-active)",
		hoverItem
	);
	$(document).on("keyup", ".omni-extension input", search);
	$(document).on("click", ".omni-item-active", handleAction);
	// TODO: look into this issue
	//$(document).on("click", ".omni-extension #omni-overlay", closeOmni);
});
