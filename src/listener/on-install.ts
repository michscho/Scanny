export function attachOnInstallListener() {
	chrome.runtime.onInstalled.addListener((object) => {
		const manifest = chrome.runtime.getManifest();

		const injectIntoTab = (tab: chrome.tabs.Tab) => {
			const scripts = manifest.content_scripts![0].js;
			const s = scripts!.length;

			for (let i = 0; i < s; i++) {
				chrome.scripting.executeScript({
					target: { tabId: tab.id },
					files: [scripts![i]],
				});
			}

			chrome.scripting.insertCSS({
				target: { tabId: tab.id },
				files: [manifest.content_scripts![0].css![0]],
			});
		};

		chrome.windows.getAll(
			{
				populate: true,
			},
			(windows) => {
				let currentWindow: chrome.windows.Window;
				const w = windows.length;

				for (let i = 0; i < w; i++) {
					currentWindow = windows[i];

					let currentTab: chrome.tabs.Tab;
					const t = currentWindow.tabs.length;

					for (let j = 0; j < t; j++) {
						currentTab = currentWindow.tabs[j];
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
			chrome.tabs.create({ url: "mischo.github.com" });
		}
	});
}
