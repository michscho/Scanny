import $ from "jquery";

export function checkShortHand(
	keyEvent: JQuery.KeyUpEvent<Document, undefined, any, any>,
	value: string
) {
	var element = $(".omni-extension input");
	if (keyEvent.keyCode != 8) {
		if (value == "/t") {
			element.val("/tabs ");
		} else if (value == "/b") {
			element.val("/bookmarks ");
		} else if (value == "/h") {
			element.val("/history ");
		} else if (value == "/r") {
			element.val("/remove ");
		} else if (value == "/a") {
			element.val("/actions ");
		} else if (value == "/i") {
			element.val("/interactive ");
		}
	} else {
		if (
			value == "/tabs" ||
			value == "/bookmarks" ||
			value == "/actions" ||
			value == "/remove" ||
			value == "/history" ||
			value == "/interactive"
		) {
			element.val("");
		}
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

export function validURL(str: string) {
	var pattern = new RegExp(
		"^(https?:\\/\\/)?" + // protocol
			"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
			"((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
			"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
			"(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
			"(\\#[-a-z\\d_]*)?$",
		"i"
	); // fragment locator
	return !!pattern.test(str);
}
