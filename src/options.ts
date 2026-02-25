const slider = document.getElementById("opacity-slider")! as HTMLInputElement;
const valueDisplay = document.getElementById("opacity-value")!;
const preview = document.getElementById("opacity-preview")! as HTMLElement;
const savedMsg = document.getElementById("saved-msg")!;

function updatePreview(val: number) {
	const opacity = val / 100;
	valueDisplay.textContent = `${val}%`;
	preview.style.opacity = String(opacity);
}

chrome.storage.sync.get({ overlayOpacity: 20 }, (result: { overlayOpacity: number }) => {
	const val = result.overlayOpacity;
	slider.value = String(val);
	updatePreview(val);
});

slider.addEventListener("input", () => {
	const val = parseInt(slider.value, 10);
	updatePreview(val);
});

slider.addEventListener("change", () => {
	const val = parseInt(slider.value, 10);
	chrome.storage.sync.set({ overlayOpacity: val }, () => {
		savedMsg.classList.add("show");
		setTimeout(() => savedMsg.classList.remove("show"), 1500);
	});
});
