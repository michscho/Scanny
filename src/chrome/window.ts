export const openIncognito = () => {
	chrome.windows.create({ incognito: true });
};
export const closeWindow = (id) => {
	chrome.windows.remove(id);
};
