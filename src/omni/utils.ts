import $ from "jquery";
import { keyMapings } from "../utils/key-mappings";

const shortHandRecord: Record<string, string> = {
	"/t": "/tabs ",
	"/b": "/bookmarks ",
	"/h": "/history ",
	"/r": "/remove ",
	"/a": "/actions ",
	"/i": "/interactive ",
};

function getShortHandValues() {
	return Object.keys(shortHandRecord).map((key) => {
		return shortHandRecord[key];
	});
}

export function checkShortHand(
	keyEvent: JQuery.KeyUpEvent<Document, undefined, any, any>,
	value: string
) {
	var element = $(".omni-extension input");

	if (keyEvent.keyCode !== keyMapings.backspace) {
		const shortHand = shortHandRecord[value];
		if (shortHand) {
			element.val(shortHand);
		}
		return;
	}

	if (getShortHandValues().includes(value)) {
		element.val("");
	}
}

export function hoverItem() {
	$(".omni-item-active").removeClass("omni-item-active");
	$(this).addClass("omni-item-active");
}

export function showToast(action: { title: string }) {
	$("#omni-extension-toast span").html(
		'"' + action.title + '" has been successfully performed'
	);
	$("#omni-extension-toast").addClass("omni-show-toast");
	setTimeout(() => {
		$(".omni-show-toast").removeClass("omni-show-toast");
	}, 3000);
}

export function addhttp(url: string) {
	if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
		url = "http://" + url;
	}
	return url;
}

const protocol = "^(https?:\\/\\/)?";
const domainName = "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|";
const ipAdress = "((\\d{1,3}\\.){3}\\d{1,3}))";
const portAndPath = "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*";
const queryString = "(\\?[;&a-z\\d%_.~+=-]*)?";

export function validURL(str: string) {
	var pattern = new RegExp(
		protocol +
			domainName +
			ipAdress +
			portAndPath +
			queryString +
			"(\\#[-a-z\\d_]*)?$",
		"i"
	);
	return Boolean(pattern.test(str));
}
