import isURL from "validator/lib/isURL";
import { keyMapings } from "../utils/key-mappings";

const shortHandRecord: Record<string, string> = {
	"/t": "/tabs ",
	"/b": "/bookmarks ",
	"/h": "/history ",
	"/r": "/remove ",
	"/a": "/actions ",
};

export function checkShortHand(
	keyEvent: React.KeyboardEvent<HTMLInputElement>,
	value: string
) {
	const shortHand = shortHandRecord[value];
	if (keyEvent.keyCode !== keyMapings.backspace && shortHand) {
		keyEvent.currentTarget.value = shortHand;
	} 
}

export function addhttp(url: string) {
	if (/^javascript:/i.test(url)) {
		return "about:blank";
	}
	if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
		url = "http://" + url;
	}
	return url;
}

export function validURL(str: string) {
	return isURL(str);
}
