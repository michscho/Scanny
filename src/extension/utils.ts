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
	keyEvent: React.KeyboardEvent<HTMLInputElement>,
	value: string
) {
	console.log("checkShortHand", keyEvent, value);
	const element = $(".omni-extension input");
	console.log("element", element);
	const shortHand = shortHandRecord[value];
	if (keyEvent.keyCode !== keyMapings.backspace && shortHand) {
		element.val(shortHand);
	} else if (getShortHandValues().includes(value)) {
		element.val("");
	}
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
