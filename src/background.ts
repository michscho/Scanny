import { getCurrentTab } from "./chrome/tab";
import { attachOnInstallListener } from "./listener/on-install";
import { attachChromeTabListener } from "./listener/tabs";
import { attachOnMessageListener } from "./listener/on-message";
import { Action } from "./actions/data/types-data";
import { resetAllActions } from "./actions/reset-actions";

let actions: Action[] = [];
let newtaburl = "";

attachOnInstallListener();

chrome.action.onClicked.addListener((tab) => {
	chrome.tabs.sendMessage(tab.id!, { request: "open-omni" });
});

chrome.commands.onCommand.addListener((command) => {
	if (command === "open-omni") {
		getCurrentTab().then((response) => {
			if (
				!response.url!.includes("chrome://") &&
				!response.url!.includes("chrome.google.com")
			) {
				chrome.tabs.sendMessage(response.id!, { request: "open-omni" });
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

attachChromeTabListener(resetAllActions);
attachOnMessageListener(resetAllActions);

actions = resetAllActions();
