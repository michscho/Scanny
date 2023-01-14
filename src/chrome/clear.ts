export const clearAllData = () => {
	chrome.browsingData.remove(
		{
			since: new Date().getTime(),
		},
		{
			appcache: true,
			cache: true,
			cookies: true,
			downloads: true,
			fileSystems: true,
			formData: true,
			history: true,
			indexedDB: true,
			localStorage: true,
			passwords: true,
			serviceWorkers: true,
			webSQL: true,
		}
	);
};
export const clearBrowsingData = () => {
	chrome.browsingData.removeHistory({ since: 0 });
};
export const clearCookies = () => {
	chrome.browsingData.removeCookies({ since: 0 });
};
export const clearCache = () => {
	chrome.browsingData.removeCache({ since: 0 });
};
export const clearLocalStorage = () => {
	chrome.browsingData.removeLocalStorage({ since: 0 });
};
export const clearPasswords = () => {
	chrome.browsingData.removePasswords({ since: 0 });
};
