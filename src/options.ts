const slider = document.getElementById("opacity-slider")! as HTMLInputElement;
const valueDisplay = document.getElementById("opacity-value")!;
const preview = document.getElementById("opacity-preview")! as HTMLElement;
const savedMsg = document.getElementById("saved-msg")!;
const positionSelect = document.getElementById(
	"position-select"
) as HTMLSelectElement;
const openAiKeyInput = document.getElementById(
	"openai-key-input"
) as HTMLInputElement;
const saveOpenAiKeyButton = document.getElementById(
	"save-openai-key"
) as HTMLButtonElement;

type CommandBarPosition = "top" | "center" | "bottom";

function updatePreview(val: number) {
	const opacity = val / 100;
	valueDisplay.textContent = `${val}%`;
	preview.style.opacity = String(opacity);
}

function showSavedMessage() {
	savedMsg.classList.add("show");
	setTimeout(() => savedMsg.classList.remove("show"), 1500);
}

chrome.storage.sync.get(
	{
		overlayOpacity: 20,
		commandBarPosition: "top" as CommandBarPosition,
		openAIApiKey: "",
	},
	(result) => {
		const val = result.overlayOpacity;
		slider.value = String(val);
		updatePreview(val);
		positionSelect.value = result.commandBarPosition;
		openAiKeyInput.value = result.openAIApiKey;
	}
);

slider.addEventListener("input", () => {
	const val = parseInt(slider.value, 10);
	updatePreview(val);
});

slider.addEventListener("change", () => {
	const val = parseInt(slider.value, 10);
	chrome.storage.sync.set({ overlayOpacity: val }, () => {
		showSavedMessage();
	});
});

positionSelect.addEventListener("change", () => {
	const value = positionSelect.value as CommandBarPosition;
	chrome.storage.sync.set({ commandBarPosition: value }, () => {
		showSavedMessage();
	});
});

function saveOpenAiKey() {
	chrome.storage.sync.set({ openAIApiKey: openAiKeyInput.value.trim() }, () => {
		showSavedMessage();
	});
}

saveOpenAiKeyButton.addEventListener("click", saveOpenAiKey);
openAiKeyInput.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		event.preventDefault();
		saveOpenAiKey();
	}
});
