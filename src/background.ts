import { resetOmni } from "./omni/omni";
import { getCurrentTab } from "./chrome/tab";
import { Action } from "./actions/actions-data";
import { attachOnInstallListener } from "./listener/on-install";
import { attachChromeTabListener } from "./listener/tabs";
import { attachOnMessageListener } from "./listener/on-message";

// Actually, Content scripts are JavaScript files that run in the context of web pages. By using the
// standard Document Object Model (DOM), they can read details of the web pages the browser
// visits, or make changes to them.

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

// TODO: DO IT RIGHT?
attachChromeTabListener(resetOmni);
attachOnMessageListener(resetOmni);

actions = resetOmni();
