import isURL from "validator/lib/isURL";
import { keyMapings } from "../utils/key-mappings";

const shortHandRecord: Record<string, string> = {
	"/t": "/tabs ",
	"/b": "/bookmarks ",
	"/h": "/history ",
	"/r": "/remove ",
	"/a": "/actions ",
};

function getShortHandValues() {
	return Object.values(shortHandRecord);
}

export function checkShortHand(
	keyEvent: React.KeyboardEvent<HTMLInputElement>,
	value: string
) {
	const shortHand = shortHandRecord[value];
	if (keyEvent.keyCode !== keyMapings.backspace && shortHand) {
		keyEvent.currentTarget.value = shortHand;
	} else if (getShortHandValues().includes(value)) {
		keyEvent.currentTarget.value = "";
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
