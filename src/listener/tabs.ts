export function attachChromeTabListener(functionToCall) {
	chrome.tabs.onUpdated.addListener(
		(_tabId, _changeInfo, _tab) => functionToCall()
	);

	chrome.tabs.onCreated.addListener((_tab) => functionToCall());

	chrome.tabs.onRemoved.addListener(
		(_tabId, _changeInfo) => functionToCall()
	);
}
