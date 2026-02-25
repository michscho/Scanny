const slider = document.getElementById("opacity-slider")! as HTMLInputElement;
const valueDisplay = document.getElementById("opacity-value")!;
const preview = document.getElementById("opacity-preview")! as HTMLElement;
const tabButtons = Array.from(
	document.querySelectorAll("[data-tab-target]")
) as HTMLButtonElement[];
const tabPanels = Array.from(
	document.querySelectorAll("[data-tab-panel]")
) as HTMLElement[];
const previewCommand = document.getElementById(
	"scanny-preview-command"
) as HTMLElement;
const previewShell = document.getElementById(
	"scanny-preview-shell"
) as HTMLElement;
const previewItems = Array.from(
	document.querySelectorAll(".scanny-preview-item")
) as HTMLElement[];
const savedMsg = document.getElementById("saved-msg")!;
const blurSlider = document.getElementById("blur-slider")! as HTMLInputElement;
const blurValueDisplay = document.getElementById("blur-value")!;
const maxRowsSlider = document.getElementById("rows-slider")! as HTMLInputElement;
const maxRowsValueDisplay = document.getElementById("rows-value")!;
const autoPreviewCheckbox = document.getElementById(
	"auto-preview-checkbox"
) as HTMLInputElement;
const resetOnboardingButton = document.getElementById(
	"reset-onboarding"
) as HTMLButtonElement;
const resetSettingsButton = document.getElementById(
	"reset-settings"
) as HTMLButtonElement;
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
type SettingsState = {
	overlayOpacity: number;
	overlayBlur: number;
	maxVisibleRows: number;
	autoPreviewPageElements: boolean;
	commandBarPosition: CommandBarPosition;
	openAIApiKey: string;
	onboardingCompleted: boolean;
};

const DEFAULT_SETTINGS: SettingsState = {
	overlayOpacity: 20,
	overlayBlur: 2,
	maxVisibleRows: 6,
	autoPreviewPageElements: true,
	commandBarPosition: "top",
	openAIApiKey: "",
	onboardingCompleted: false,
};

function updatePreview(val: number) {
	const opacity = val / 100;
	valueDisplay.textContent = `${val}%`;
	preview.style.opacity = String(opacity);
}

function updateBlurPreview(val: number) {
	blurValueDisplay.textContent = `${val}px`;
	preview.style.backdropFilter = `blur(${val}px)`;
}

function updateRowsPreview(val: number) {
	maxRowsValueDisplay.textContent = String(val);
	previewItems.forEach((item, index) => {
		item.style.display = index < val ? "flex" : "none";
	});
}

function updatePositionPreview(position: CommandBarPosition) {
	previewShell.dataset.position = position;
}

function updateAutoPreview(enabled: boolean) {
	previewShell.dataset.autoPreview = enabled ? "on" : "off";
}

function activateTab(tabName: string) {
	tabButtons.forEach((button) => {
		const isActive = button.dataset.tabTarget === tabName;
		button.classList.toggle("is-active", isActive);
		button.setAttribute("aria-selected", String(isActive));
	});
	tabPanels.forEach((panel) => {
		panel.classList.toggle("is-active", panel.dataset.tabPanel === tabName);
	});
}

function showSavedMessage() {
	savedMsg.classList.add("show");
	setTimeout(() => savedMsg.classList.remove("show"), 1500);
}

function applySettingsToForm(state: SettingsState) {
	const opacity = Number(state.overlayOpacity);
	slider.value = String(opacity);
	updatePreview(opacity);

	const blur = Number(state.overlayBlur);
	blurSlider.value = String(blur);
	updateBlurPreview(blur);
	previewCommand.style.background = "rgba(22, 24, 30, 0.95)";

	const rows = Number(state.maxVisibleRows);
	maxRowsSlider.value = String(rows);
	updateRowsPreview(rows);

	autoPreviewCheckbox.checked = state.autoPreviewPageElements !== false;
	positionSelect.value = state.commandBarPosition;
	updatePositionPreview(state.commandBarPosition);
	updateAutoPreview(state.autoPreviewPageElements !== false);

	openAiKeyInput.value = state.openAIApiKey;
}

chrome.storage.sync.get(
	DEFAULT_SETTINGS,
	(result) => {
		applySettingsToForm(result as SettingsState);
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

blurSlider.addEventListener("input", () => {
	const val = parseInt(blurSlider.value, 10);
	updateBlurPreview(val);
});

blurSlider.addEventListener("change", () => {
	const val = parseInt(blurSlider.value, 10);
	chrome.storage.sync.set({ overlayBlur: val }, () => {
		showSavedMessage();
	});
});

maxRowsSlider.addEventListener("input", () => {
	const val = parseInt(maxRowsSlider.value, 10);
	updateRowsPreview(val);
});

maxRowsSlider.addEventListener("change", () => {
	const val = parseInt(maxRowsSlider.value, 10);
	chrome.storage.sync.set({ maxVisibleRows: val }, () => {
		showSavedMessage();
	});
});

autoPreviewCheckbox.addEventListener("change", () => {
	updateAutoPreview(autoPreviewCheckbox.checked);
	chrome.storage.sync.set(
		{ autoPreviewPageElements: autoPreviewCheckbox.checked },
		() => {
			showSavedMessage();
		}
	);
});

resetOnboardingButton.addEventListener("click", () => {
	chrome.storage.sync.set({ onboardingCompleted: false }, () => {
		showSavedMessage();
	});
});

resetSettingsButton.addEventListener("click", () => {
	chrome.storage.sync.set(DEFAULT_SETTINGS, () => {
		applySettingsToForm(DEFAULT_SETTINGS);
		showSavedMessage();
	});
});

positionSelect.addEventListener("change", () => {
	const value = positionSelect.value as CommandBarPosition;
	updatePositionPreview(value);
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

tabButtons.forEach((button) => {
	button.addEventListener("click", () => {
		const tabName = button.dataset.tabTarget;
		if (!tabName) return;
		activateTab(tabName);
	});
});
