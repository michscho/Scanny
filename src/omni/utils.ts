import $ from "jquery";
import isURL from "validator/lib/isURL";
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
	return Object.values(shortHandRecord);
}

export function checkShortHand(
	keyEvent: JQuery.KeyUpEvent<Document, undefined, any, any>,
	value: string
) {
	const element = $(".omni-extension input");
	const shortHand = shortHandRecord[value];
	if (keyEvent.keyCode !== keyMapings.backspace && shortHand) {
		element.val(shortHand);
	} else if (getShortHandValues().includes(value)) {
		element.val("");
	}
}

export function hoverItem() {
	$(".omni-item-active").removeClass("omni-item-active");
	$(this).addClass("omni-item-active");
}

export function showToast(action: { title: string }) {
	$("#omni-extension-toast span").html(
		`"${action.title}" has been successfully performed`
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

export function validURL(str: string) {
	return isURL(str);
}
