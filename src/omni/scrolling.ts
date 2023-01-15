import $ from "jquery";

export function scrollUp() {
	if ($(".omni-item-active").prevAll("div").not(":hidden").first().length) {
		var previous = $(".omni-item-active").prevAll("div").not(":hidden").first();
		$(".omni-item-active").removeClass("omni-item-active");
		previous.addClass("omni-item-active");
		previous[0].scrollIntoView({ block: "nearest", inline: "nearest" });
	}
}

export function scrollDown() {
	if ($(".omni-item-active").nextAll("div").not(":hidden").first().length) {
		var next = $(".omni-item-active").nextAll("div").not(":hidden").first();
		$(".omni-item-active").removeClass("omni-item-active");
		next.addClass("omni-item-active");
		next[0].scrollIntoView({ block: "nearest", inline: "nearest" });
	}
}
