import $ from "jquery";

export function checkShortHand(e, value) {
	var el = $(".omni-extension input");
	if (e.keyCode != 8) {
		if (value == "/t") {
			el.val("/tabs ");
		} else if (value == "/b") {
			el.val("/bookmarks ");
		} else if (value == "/h") {
			el.val("/history ");
		} else if (value == "/r") {
			el.val("/remove ");
		} else if (value == "/a") {
			el.val("/actions ");
		} else if (value == "/i") {
			el.val("/interactive ");
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
			el.val("");
		}
	}
}

export function hoverItem() {
	$(".omni-item-active").removeClass("omni-item-active");
	$(this).addClass("omni-item-active");
}

export function showToast(action) {
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

export function validURL(str) {
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
