import $ from "jquery";
import { closeExtension, openExtension } from "./extension/extension";
import { initHintMode } from "./interactive/hint-mode";

$(function () {
	chrome.runtime.onMessage.addListener((message) => {
		if (message.request === "open-scanny") {
			openExtension([]);
		}
		if (message.request === "close-scanny") {
			closeExtension();
		}
	});

	initHintMode();
});
