import { getCurrentTab } from "./chrome/tab";
import { attachOnInstallListener } from "./listener/on-install";
import { attachChromeTabListener } from "./listener/tabs";
import { attachOnMessageListener } from "./listener/on-message";
import { Action } from "./actions/data/types-data";
import { resetActions } from "./actions/reset-actions";

let actions: Action[] = [];
let newtaburl = "";

attachOnInstallListener();

chrome.action.onClicked.addListener((tab) => {
	chrome.tabs.sendMessage(tab.id!, { request: "open-scanny" });
});

chrome.commands.onCommand.addListener((command) => {
	if (command === "open-scanny") {
		getCurrentTab().then((response) => {
			if (
				!response.url!.includes("chrome://") &&
				!response.url!.includes("chrome.google.com")
			) {
				chrome.tabs.sendMessage(response.id!, { request: "open-scanny" });
			} else {
				chrome.tabs
					.create({
						url: "./newtab.html",
					})
					.then(() => {
						newtaburl = response.url!;
						chrome.tabs.remove(response.id!);
					});
			}
		});
	}
});

attachChromeTabListener(resetActions);
attachOnMessageListener(resetActions);

actions = resetActions();
