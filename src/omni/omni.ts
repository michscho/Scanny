import { resetActions } from "../actions/action-utils";
import { Action, searchActionData } from "../actions/actions-data";
import { getBookmarks } from "../chrome/bookmarks";
import { getTabs } from "../chrome/tab";
import { VirtualizedList } from "virtualized-list";
import $ from "jquery";
import focusLock from "dom-focus-lock";

export const resetOmni = () => {
	const defaultActions = resetActions();
	const tabsActions = getTabs();
	const bookmarkActions = getBookmarks();
	var search = searchActionData;
	console.log([...search, ...tabsActions, ...bookmarkActions]);
	return [...search, ...defaultActions, ...tabsActions, ...bookmarkActions];
};

function renderAction(action: Action, index: number, keys, img) {
	var skip = "";
	if (action.action == "search" || action.action == "goto") {
		skip = "style='display:none'";
	}
	if (index != 0) {
		$("#omni-extension #omni-list").append(
			"<div class='omni-item' " +
				skip +
				" data-index='" +
				index +
				"' data-type='" +
				action.type +
				"'>" +
				img +
				"<div class='omni-item-details'><div class='omni-item-name'>" +
				action.title +
				"</div><div class='omni-item-desc'>" +
				action.desc +
				"</div></div>" +
				keys +
				"<div class='omni-select'>Select <span class='omni-shortcut'>⏎</span></div></div>"
		);
	} else {
		$("#omni-extension #omni-list").append(
			"<div class='omni-item omni-item-active' " +
				skip +
				" data-index='" +
				index +
				"' data-type='" +
				action.type +
				"'>" +
				img +
				"<div class='omni-item-details'><div class='omni-item-name'>" +
				action.title +
				"</div><div class='omni-item-desc'>" +
				action.desc +
				"</div></div>" +
				keys +
				"<div class='omni-select'>Select <span class='omni-shortcut'>⏎</span></div></div>"
		);
	}
	if (!action.emoji) {
		var loadimg = new Image();
		loadimg.src = action.favIconUrl;

		// Favicon doesn't load, use a fallback
		loadimg.onerror = () => {
			$(".omni-item[data-index='" + index + "'] img").attr(
				"src",
				chrome.runtime.getURL("/icons/globe.svg")
			);
		};
	}
}

export function closeOmni(isOpen: boolean) {
	if (
		window.location.href ==
		"chrome-extension://mpanekjjajcabgnlbabmopeenljeoggm/newtab.html"
	) {
		chrome.runtime.sendMessage({ request: "restore-new-tab" });
	} else {
		isOpen = false;
		$("#omni-extension").addClass("omni-closing");
	}
}

export function populateOmni(actions) {
	$("#omni-extension #omni-list").html("");
	actions.forEach((action, index) => {
		var keys = "";
		if (action.keycheck) {
			keys = "<div class='omni-keys'>";
			action.keys.forEach(function (key) {
				keys += "<span class='omni-shortcut'>" + key + "</span>";
			});
			keys += "</div>";
		}

		if (!action.emoji) {
			var onload =
				'if ("naturalHeight" in this) {if (this.naturalHeight + this.naturalWidth === 0) {this.onerror();return;}} else if (this.width + this.height == 0) {this.onerror();return;}';
			var img =
				"<img src='" +
				action.favIconUrl +
				"' alt='favicon' onload='" +
				onload +
				"' onerror='this.src=&quot;" +
				chrome.runtime.getURL("/icons/globe.svg") +
				"&quot;' class='omni-icon'>";
			renderAction(action, index, keys, img);
		} else {
			var img =
				"<span class='omni-emoji-action'>" + action.emojiChar + "</span>";
			renderAction(action, index, keys, img);
		}
	});
	$(".omni-extension #omni-results").html(actions.length + " results");
}

export function openOmni(isOpen: boolean, actions: Action[]) {
	chrome.runtime.sendMessage({ request: "get-actions" }, (response) => {
		isOpen = true;
		actions = response.actions;
		$("#omni-extension input").val("");
		populateOmni(actions);
		$("html, body").stop();
		$("#omni-extension").removeClass("omni-closing");
		window.setTimeout(() => {
			$("#omni-extension input").focus();
			focusLock.on($("#omni-extension input").get(0));
			$("#omni-extension input").focus();
		}, 100);
	});
}

export function populateOmniFilter(actions, isFiltered) {
	isFiltered = true;
	$("#omni-extension #omni-list").html("");
	const renderRow = (index) => {
		const action = actions[index];
		var keys = "";
		if (action.keycheck) {
			keys = "<div class='omni-keys'>";
			action.keys.forEach(function (key) {
				keys += "<span class='omni-shortcut'>" + key + "</span>";
			});
			keys += "</div>";
		}
		var img =
			"<img src='" +
			action.favIconUrl +
			"' alt='favicon' onerror='this.src=&quot;" +
			chrome.runtime.getURL("/icons/globe.svg") +
			"&quot;' class='omni-icon'>";
		if (action.emoji) {
			img = "<span class='omni-emoji-action'>" + action.emojiChar + "</span>";
		}
		if (index != 0) {
			return $(
				"<div class='omni-item' data-index='" +
					index +
					"' data-type='" +
					action.type +
					"' data-url='" +
					action.url +
					"'>" +
					img +
					"<div class='omni-item-details'><div class='omni-item-name'>" +
					action.title +
					"</div><div class='omni-item-desc'>" +
					action.url +
					"</div></div>" +
					keys +
					"<div class='omni-select'>Select <span class='omni-shortcut'>⏎</span></div></div>"
			)[0];
		} else {
			return $(
				"<div class='omni-item omni-item-active' data-index='" +
					index +
					"' data-type='" +
					action.type +
					"' data-url='" +
					action.url +
					"'>" +
					img +
					"<div class='omni-item-details'><div class='omni-item-name'>" +
					action.title +
					"</div><div class='omni-item-desc'>" +
					action.url +
					"</div></div>" +
					keys +
					"<div class='omni-select'>Select <span class='omni-shortcut'>⏎</span></div></div>"
			)[0];
		}
	};
	actions.length &&
		new VirtualizedList.default($("#omni-extension #omni-list")[0], {
			height: 400,
			rowHeight: 60,
			rowCount: actions.length,
			renderRow,
			onMount: () =>
				$(".omni-extension #omni-results").html(actions.length + " results"),
		});
}
