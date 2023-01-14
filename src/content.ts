import $ from "jquery";
import {
	clickElement,
	findClickableElementsText,
} from "./interactive/interactive";
import {
	closeOmni,
	openOmni,
	populateOmni,
	populateOmniFilter,
} from "./omni/omni";
import {
	checkShortHand,
	showToast,
	hoverItem,
	addhttp,
	validURL,
} from "./omni/utils";

var isOpen = false;

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

		// Request actions from the background
		chrome.runtime.sendMessage({ request: "get-actions" }, (response) => {
			actions = response.actions;
		});

		// New tab page workaround
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

	function hideSearchAndGoToActions() {
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

	// Search for an action in the omni
	function search(e) {
		if (
			e.keyCode == 37 ||
			e.keyCode == 38 ||
			e.keyCode == 39 ||
			e.keyCode == 40 ||
			e.keyCode == 13 ||
			e.keyCode == 37
		) {
			return;
		}
		var value = $(this).val().toLowerCase();
		checkShortHand(e, value);
		value = $(this).val().toLowerCase();

		if (value.startsWith("/history")) {
			hideSearchAndGoToActions();
			var tempvalue = value.replace("/history ", "");
			var query = "";
			if (tempvalue != "/history") {
				query = value.replace("/history ", "");
			}
			chrome.runtime.sendMessage(
				{ request: "search-history", query: query },
				(response) => {
					populateOmniFilter(response.history, isFiltered);
				}
			);
		} else if (value.startsWith("/bookmarks")) {
			hideSearchAndGoToActions();
			var tempvalue = value.replace("/bookmarks ", "");
			if (tempvalue != "/bookmarks" && tempvalue != "") {
				var query = value.replace("/bookmarks ", "");
				chrome.runtime.sendMessage(
					{ request: "search-bookmarks", query: query },
					(response) => {
						populateOmniFilter(response.bookmarks, isFiltered);
					}
				);
			} else {
				populateOmniFilter(
					actions.filter((x) => x.type == "bookmark"),
					isFiltered
				);
			}
		} else if (value.startsWith("/interactive")) {
			hideSearchAndGoToActions();
			var tempvalue = value.replace("/interactive ", "");
			if (tempvalue != "/interactive") {
				const newActions = findClickableElementsText(
					$(this).val().replace("/interactive ", "")
				);
				populateOmniFilter(newActions, isFiltered);
				isFiltered = false;
			} else {
				populateOmniFilter(
					actions.filter((x) => x.type == "interactive"),
					isFiltered
				);
			}
		} else {
			if (isFiltered) {
				populateOmni(actions);
				isFiltered = false;
			}
			$(".omni-extension #omni-list .omni-item").filter(function () {
				if (value.startsWith("/tabs")) {
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
					var tempvalue = value.replace("/tabs ", "");
					if (tempvalue == "/tabs") {
						$(this).toggle($(this).attr("data-type") == "tab");
					} else {
						tempvalue = value.replace("/tabs ", "");
						$(this).toggle(
							($(this)
								.find(".omni-item-name")
								.text()
								.toLowerCase()
								.indexOf(tempvalue) > -1 ||
								$(this)
									.find(".omni-item-desc")
									.text()
									.toLowerCase()
									.indexOf(tempvalue) > -1) &&
								$(this).attr("data-type") == "tab"
						);
					}
				} else if (value.startsWith("/remove")) {
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
					var tempvalue = value.replace("/remove ", "");
					if (tempvalue == "/remove") {
						$(this).toggle(
							$(this).attr("data-type") == "bookmark" ||
								$(this).attr("data-type") == "tab"
						);
					} else {
						tempvalue = value.replace("/remove ", "");
						$(this).toggle(
							($(this)
								.find(".omni-item-name")
								.text()
								.toLowerCase()
								.indexOf(tempvalue) > -1 ||
								$(this)
									.find(".omni-item-desc")
									.text()
									.toLowerCase()
									.indexOf(tempvalue) > -1) &&
								($(this).attr("data-type") == "bookmark" ||
									$(this).attr("data-type") == "tab")
						);
					}
				} else if (value.startsWith("/actions")) {
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
					var tempvalue = value.replace("/actions ", "");
					if (tempvalue == "/actions") {
						$(this).toggle($(this).attr("data-type") == "action");
					} else {
						tempvalue = value.replace("/actions ", "");
						$(this).toggle(
							($(this)
								.find(".omni-item-name")
								.text()
								.toLowerCase()
								.indexOf(tempvalue) > -1 ||
								$(this)
									.find(".omni-item-desc")
									.text()
									.toLowerCase()
									.indexOf(tempvalue) > -1) &&
								$(this).attr("data-type") == "action"
						);
					}
				} else {
					$(this).toggle(
						$(this)
							.find(".omni-item-name")
							.text()
							.toLowerCase()
							.indexOf(value) > -1 ||
							$(this)
								.find(".omni-item-desc")
								.text()
								.toLowerCase()
								.indexOf(value) > -1
					);
					if (value == "") {
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
					} else if (!validURL(value)) {
						$(
							".omni-item[data-index='" +
								actions.findIndex((x) => x.action == "search") +
								"']"
						).show();
						$(
							".omni-item[data-index='" +
								actions.findIndex((x) => x.action == "goto") +
								"']"
						).hide();
						$(
							".omni-item[data-index='" +
								actions.findIndex((x) => x.action == "search") +
								"'] .omni-item-name"
						).html('"' + value + '"');
					} else {
						$(
							".omni-item[data-index='" +
								actions.findIndex((x) => x.action == "search") +
								"']"
						).hide();
						$(
							".omni-item[data-index='" +
								actions.findIndex((x) => x.action == "goto") +
								"']"
						).show();
						$(
							".omni-item[data-index='" +
								actions.findIndex((x) => x.action == "goto") +
								"'] .omni-item-name"
						).html(value);
					}
				}
			});
		}

		$(".omni-extension #omni-results").html(
			$("#omni-extension #omni-list .omni-item:visible").length + " results"
		);
		$(".omni-item-active").removeClass("omni-item-active");
		$(".omni-extension #omni-list .omni-item:visible")
			.first()
			.addClass("omni-item-active");
	}

	function handleAction(e) {
		var action = actions[$(".omni-item-active").attr("data-index")];
		closeOmni(isOpen);
		if ($(".omni-extension input").val().toLowerCase().startsWith("/remove")) {
			chrome.runtime.sendMessage({
				request: "remove",
				type: action.type,
				action: action,
			});
		} else if (
			$(".omni-extension input").val().toLowerCase().startsWith("/history")
		) {
			if (e.ctrlKey || e.metaKey) {
				window.open($(".omni-item-active").attr("data-url"));
			} else {
				window.open($(".omni-item-active").attr("data-url"), "_self");
			}
		} else if (
			$(".omni-extension input").val().toLowerCase().startsWith("/bookmarks")
		) {
			if (e.ctrlKey || e.metaKey) {
				window.open($(".omni-item-active").attr("data-url"));
			} else {
				window.open($(".omni-item-active").attr("data-url"), "_self");
			}
		} else if (
			$(".omni-extension input").val().toLowerCase().startsWith("/interactive")
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
			populateOmni(actions);
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
					populateOmni(actions);
				});
			} else if (down[18] && down[16] && down[77]) {
				if (actions.find((x) => x.action == "mute") != undefined) {
					chrome.runtime.sendMessage({ request: "mute-tab" });
				} else {
					chrome.runtime.sendMessage({ request: "unmute-tab" });
				}
				chrome.runtime.sendMessage({ request: "get-actions" }, (response) => {
					actions = response.actions;
					populateOmni(actions);
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
	$(document).on("click", ".omni-extension #omni-overlay", closeOmni);
});
