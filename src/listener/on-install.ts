export function attachOnInstallListener() {
	chrome.runtime.onInstalled.addListener((object) => {
		const manifest = chrome.runtime.getManifest();
		const contentScript = manifest.content_scripts?.[0];
		const scripts = contentScript?.js ?? [];
		const cssFiles = contentScript?.css ?? [];

		const injectIntoTab = (tab: chrome.tabs.Tab) => {
			if (!tab.id) {
				return;
			}

			for (let i = 0; i < scripts.length; i++) {
				chrome.scripting.executeScript({
					target: { tabId: tab.id },
					files: [scripts[i]],
				});
			}

			if (cssFiles.length > 0) {
				chrome.scripting.insertCSS({
					target: { tabId: tab.id },
					files: [cssFiles[0]],
				});
			}
		};

		chrome.windows.getAll(
			{
				populate: true,
			},
			(windows) => {
				for (let i = 0; i < windows.length; i++) {
					const currentWindow = windows[i];
					const tabs = currentWindow.tabs ?? [];

					for (let j = 0; j < tabs.length; j++) {
						const currentTab = tabs[j];
						if (!currentTab.url) {
							continue;
						}
						if (
							!currentTab.url.includes("chrome://") &&
							!currentTab.url.includes("chrome-extension://") &&
							!currentTab.url.includes("chrome.google.com")
						) {
							injectIntoTab(currentTab);
						}
					}
				}
			}
		);

		if (object.reason === "install") {
			chrome.tabs.create({ url: "https://github.com/michscho/Scanny" });
		}
	});
}
