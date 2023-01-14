export const openIncognito = () => {
	chrome.windows.create({ incognito: true });
};
export const closeWindow = (id: number) => {
	chrome.windows.remove(id);
};
