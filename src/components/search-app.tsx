import { css } from "@emotion/react";
import { useState, useRef, useEffect, CSSProperties } from "react";
import { ActionComponent } from "./action-component";
import { AppProps } from "./app";
import { Footer } from "./footer";
import { FixedSizeList, FixedSizeList as List } from "react-window";
import { search, handleShorthand } from "../search/search";
import { handleActionItem } from "../actions/handle-action";
import { focusOnElement } from "../interactive/focus";

type CommandBarPosition = "top" | "center" | "bottom";

const onboardingScreens = [
	{
		title: "Willkommen bei Scanny",
		body: "Scanny bringt eine Command Bar auf jede Website. Oeffne sie jederzeit mit Cmd/Ctrl + Shift + K.",
	},
	{
		title: "Schnell finden und handeln",
		body: "Suche nach Befehlen, Bookmarks, History oder Tabs. Mit > startest du die interaktive Seitensuche fuer klickbare Elemente.",
	},
	{
		title: "Komplett per Tastatur",
		body: "Navigiere mit Pfeiltasten, bestaetige mit Enter und schliesse mit Escape. Passe Overlay und Position in den Settings an.",
	},
];

export function SearchApp(
	searchProps: AppProps & {
		setStatus: React.Dispatch<React.SetStateAction<"open" | "closed">>;
	}
): JSX.Element {
	const MAX_ROWS = 6;
	const ROW_HEIGHT = 64;
	const [activeIndex, setActiveIndex] = useState(0);
	const [actions, setActions] = useState(searchProps.actions);
	const [searchQuery, setSearchQuery] = useState("");
	const [overlayOpacity, setOverlayOpacity] = useState(0.2);
	const [commandBarPosition, setCommandBarPosition] =
		useState<CommandBarPosition>("top");
	const [showOnboarding, setShowOnboarding] = useState(false);
	const [onboardingStep, setOnboardingStep] = useState(0);
	const [viewportWidth, setViewportWidth] = useState(
		typeof window === "undefined" ? 760 : window.innerWidth
	);
	const inputRef = useRef<HTMLInputElement>(null);
	const reactLegacyRef = useRef<List<any>>(null);

	useEffect(() => {
		const onResize = () => setViewportWidth(window.innerWidth);
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);

	useEffect(() => {
		if (!showOnboarding) {
			inputRef.current?.focus();
		}
	}, [showOnboarding]);

	useEffect(() => {
		chrome.storage.sync.get(
			{
				overlayOpacity: 20,
				commandBarPosition: "top" as CommandBarPosition,
				onboardingCompleted: false,
			},
			(result) => {
				const value = Number(result.overlayOpacity);
				if (Number.isFinite(value)) {
					setOverlayOpacity(Math.max(0, Math.min(100, value)) / 100);
				}
				if (
					result.commandBarPosition === "top" ||
					result.commandBarPosition === "center" ||
					result.commandBarPosition === "bottom"
				) {
					setCommandBarPosition(result.commandBarPosition);
				}
				setShowOnboarding(!result.onboardingCompleted);
			}
		);
	}, []);

	useEffect(() => {
		if (showOnboarding) {
			return;
		}
		if (!searchQuery.startsWith(">")) {
			return;
		}
		try {
			focusOnElement(actions[activeIndex]);
		} catch (error) {
			console.log(error);
		}
	}, [actions, activeIndex, searchQuery, showOnboarding]);

	useEffect(() => {
		if (actions.length === 0) {
			setActiveIndex(0);
			return;
		}
		if (activeIndex > actions.length - 1) {
			setActiveIndex(actions.length - 1);
		}
	}, [actions, activeIndex]);

	function completeOnboarding() {
		chrome.storage.sync.set({ onboardingCompleted: true }, () => {
			setShowOnboarding(false);
			setOnboardingStep(0);
		});
	}

	function nextOnboardingStep() {
		if (onboardingStep < onboardingScreens.length - 1) {
			setOnboardingStep(onboardingStep + 1);
			return;
		}
		completeOnboarding();
	}

	function previousOnboardingStep() {
		setOnboardingStep(Math.max(0, onboardingStep - 1));
	}

	useEffect(() => {
		if (!showOnboarding) {
			return;
		}
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault();
				completeOnboarding();
				return;
			}
			if (event.key === "Enter" || event.key === "ArrowRight") {
				event.preventDefault();
				nextOnboardingStep();
				return;
			}
			if (event.key === "ArrowLeft") {
				event.preventDefault();
				previousOnboardingStep();
			}
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [showOnboarding, onboardingStep]);

	function moveSelection(nextIndex: number, align: "auto" | "smart" | "center" = "auto") {
		if (actions.length === 0) {
			return;
		}
		const clampedIndex = Math.max(0, Math.min(actions.length - 1, nextIndex));
		setActiveIndex(clampedIndex);
		reactLegacyRef.current?.scrollToItem(clampedIndex, align);
	}

	function scrollUp() {
		moveSelection(activeIndex - 1);
	}

	function scrollDown() {
		moveSelection(activeIndex + 1);
	}

	function activateSpecialMode(actionName: string) {
		if (!inputRef.current) {
			return false;
		}
		if (actionName === "search-page") {
			inputRef.current.value = "> ";
			inputRef.current.focus();
			setSearchQuery("> ");
			search("> ", setActions, setActiveIndex);
			return true;
		}
		if (actionName === "show-help") {
			inputRef.current.value = "/help";
			inputRef.current.focus();
			setSearchQuery("/help");
			search("/help", setActions, setActiveIndex);
			return true;
		}
		if (actionName === "search-tabs") {
			inputRef.current.value = "/tabs ";
			inputRef.current.focus();
			setSearchQuery("/tabs ");
			search("/tabs ", setActions, setActiveIndex);
			return true;
		}
		if (actionName === "ask-ai") {
			inputRef.current.value = "/ai ";
			inputRef.current.focus();
			setSearchQuery("/ai ");
			search("/ai ", setActions, setActiveIndex);
			return true;
		}
		return false;
	}

	function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		const key = event.key.toLowerCase();

		if (event.key === "Escape") {
			event.preventDefault();
			searchProps.setStatus("closed");
			return;
		}

		if (event.key === "ArrowDown" || (event.ctrlKey && key === "n")) {
			event.preventDefault();
			scrollDown();
			return;
		}

		if (event.key === "ArrowUp" || (event.ctrlKey && key === "p")) {
			event.preventDefault();
			scrollUp();
			return;
		}

		if (event.key === "Home") {
			event.preventDefault();
			moveSelection(0, "smart");
			return;
		}

		if (event.key === "End") {
			event.preventDefault();
			moveSelection(actions.length - 1, "smart");
			return;
		}

		if (event.key === "PageDown") {
			event.preventDefault();
			moveSelection(activeIndex + MAX_ROWS, "smart");
			return;
		}

		if (event.key === "PageUp") {
			event.preventDefault();
			moveSelection(activeIndex - MAX_ROWS, "smart");
			return;
		}

		if (event.key === "Enter") {
			const query = inputRef.current?.value || "";
			if (!actions[activeIndex]) {
				return;
			}
			if (activateSpecialMode(actions[activeIndex].action)) {
				event.preventDefault();
				return;
			}
			searchProps.setStatus("closed");
			handleActionItem(query, actions[activeIndex], event);
			return;
		}

		handleShorthand(event);
	}

	function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const value = event.currentTarget.value;
		setSearchQuery(value);
		search(value, setActions, setActiveIndex);
	}

	function handleMouseEnter(index: number) {
		setActiveIndex(index);
	}

	function openSettings() {
		searchProps.setStatus("closed");
		chrome.runtime.sendMessage({ request: "open-scanny-settings" });
	}

	const panelWidth = Math.min(760, Math.max(320, viewportWidth - 24));
	const listWidth = panelWidth - 4;
	const listHeight = Math.max(ROW_HEIGHT, Math.min(MAX_ROWS, actions.length) * ROW_HEIGHT);
	const effectivePosition: CommandBarPosition = showOnboarding
		? "center"
		: commandBarPosition;
	const wrapPositionStyle: CSSProperties =
		effectivePosition === "center"
			? { top: "50%", bottom: "auto", transform: "translateY(-50%)" }
			: effectivePosition === "bottom"
				? {
						top: "auto",
						bottom: "max(16px, env(safe-area-inset-bottom))",
						transform: "none",
				  }
				: {
						top: "max(16px, env(safe-area-inset-top))",
						bottom: "auto",
						transform: "none",
				  };

	return (
		<div>
			<div css={styles.scannyWrap} style={wrapPositionStyle}>
				<div id="scanny" css={extension}>
					{showOnboarding ? (
						<div css={styles.onboardingWrap}>
							<div css={styles.onboardingCount}>
								{onboardingStep + 1} / {onboardingScreens.length}
							</div>
							<h2 css={styles.onboardingTitle}>
								{onboardingScreens[onboardingStep].title}
							</h2>
							<p css={styles.onboardingBody}>
								{onboardingScreens[onboardingStep].body}
							</p>
							<div css={styles.onboardingDots}>
								{onboardingScreens.map((_screen, index) => (
									<span
										key={index}
										css={index === onboardingStep ? styles.dotActive : styles.dot}
									></span>
								))}
							</div>
							<div css={styles.onboardingActions}>
								<button css={styles.secondaryButton} onClick={completeOnboarding}>
									Ueberspringen <span css={styles.buttonShortcut}>Esc</span>
								</button>
								<div css={styles.onboardingNav}>
									<button
										css={styles.secondaryButton}
										onClick={previousOnboardingStep}
										disabled={onboardingStep === 0}
									>
										Zurueck <span css={styles.buttonShortcut}>←</span>
									</button>
									<button css={styles.primaryButton} onClick={nextOnboardingStep}>
										{onboardingStep === onboardingScreens.length - 1
											? "Loslegen "
											: "Weiter "}
										<span css={styles.buttonShortcut}>Enter/→</span>
									</button>
								</div>
							</div>
						</div>
					) : (
						<>
							<div id="scanny-search" css={styles.searchBar}>
								<input
									ref={inputRef}
									css={styles.input}
									placeholder="Type a command or search..."
									onKeyDown={(e) => handleKeyDown(e)}
									onChange={(e) => handleInputChange(e)}
									autoFocus
									autoComplete="off"
									spellCheck={false}
								/>
							</div>
							<div id="scanny-list">
								{actions.length > 0 ? (
									<FixedSizeList
										height={listHeight}
										itemCount={actions.length}
										itemSize={ROW_HEIGHT}
										width={listWidth}
										ref={reactLegacyRef}
									>
										{({ index, style }) => (
											<div
												key={index}
												style={style}
												css={index === activeIndex && styles.active}
												className={`${index === activeIndex ? "scanny-item-active" : ""}`}
												onMouseEnter={() => handleMouseEnter(index)}
												onMouseDown={() => {
													if (activateSpecialMode(actions[index].action)) {
														return;
													}
													searchProps.setStatus("closed");
													const fallbackInput = {
														value: inputRef.current?.value || "",
													} as HTMLInputElement;
													handleActionItem(
														inputRef.current?.value || "",
														actions[index],
														{
															ctrlKey: false,
															metaKey: false,
															currentTarget:
																inputRef.current ?? fallbackInput,
														}
													);
												}}
											>
												<ActionComponent
													isSelected={index === activeIndex}
													action={actions[index]}
													index={index}
													query={searchQuery}
												/>
											</div>
										)}
									</FixedSizeList>
								) : (
									<div css={styles.emptyState}>
										<span css={styles.emptyIcon}>🔎</span>
										<span>No results found</span>
									</div>
								)}
							</div>
							<Footer result={actions.length} onOpenSettings={openSettings} />
						</>
					)}
				</div>
			</div>
			<div
				onClick={() => searchProps.setStatus("closed")}
				css={styles.scannyOverlay}
				style={{ opacity: overlayOpacity }}
			></div>
		</div>
	);
}

const extension = css`
	position: absolute;
	width: 100%;
	background: var(--background);
	border: 1px solid var(--border);
	border-radius: 16px;
	top: 0px;
	left: 0px;
	z-index: 9999999998;
	height: fit-content;
	transition: all 0.2s cubic-bezier(0.05, 0.03, 0.35, 1);
	backdrop-filter: blur(20px);
	box-shadow: var(--shadow);
	overflow: hidden;
	display: block;
	animation: scanny-reveal 0.22s ease-out;

	@keyframes scanny-reveal {
		from {
			transform: translateY(-8px) scale(0.985);
			opacity: 0;
		}
		to {
			transform: translateY(0) scale(1);
			opacity: 1;
		}
	}
`;

const styles = {
	active: css`
		background: linear-gradient(
			90deg,
			var(--select),
			var(--select-soft) 80%,
			transparent
		);
		position: relative;
		:before {
			height: 100%;
			position: absolute;
			display: block;
			content: "";
			width: 3px;
			background-color: var(--accent);
			box-shadow: 0 0 20px color-mix(in srgb, var(--accent) 80%, transparent);
		}
	`,
	scannyWrap: css`
		position: fixed;
		width: min(760px, calc(100vw - 24px));
		border: 1px solid transparent;
		border-radius: 16px;
		margin: auto;
		top: max(16px, env(safe-area-inset-top));
		right: 0px;
		bottom: 16px;
		left: 0px;
		z-index: 9999999999;
		height: fit-content;
		max-height: calc(100vh - 32px);
		transition: all 0.2s cubic-bezier(0.05, 0.03, 0.35, 1);
		pointer-events: all;
	`,
	scannyOverlay: css`
		height: 100%;
		width: 100%;
		position: fixed;
		top: 0px;
		left: 0px;
		background: radial-gradient(circle at top, rgba(17, 43, 68, 0.28), rgba(8, 11, 16, 0.6));
		z-index: 9999;
		opacity: 1;
		backdrop-filter: blur(2px);
		transition: all 0.1s cubic-bezier(0.05, 0.03, 0.35, 1);
	`,
	searchBar: css`
		padding: 10px 14px;
	`,
	input: css`
		background: color-mix(in srgb, var(--background-solid) 88%, white 12%);
		border: 1px solid color-mix(in srgb, var(--border) 82%, transparent);
		outline: none;
		font-size: 18px;
		font-weight: 500;
		height: 52px;
		width: 100%;
		margin-left: auto;
		margin-right: auto;
		display: block;
		color: var(--text);
		caret-color: var(--text);
		font-family: "Inter", "Avenir Next", "Segoe UI", sans-serif !important;
		box-sizing: border-box;
		outline: none;
		box-shadow: none;
		border-radius: 11px;
		padding: 0 14px;
		transition: border-color 0.15s ease, box-shadow 0.15s ease;

		:focus {
			border-color: color-mix(in srgb, var(--accent) 50%, var(--border));
			box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 22%, transparent);
		}
	`,
	emptyState: css`
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 32px 20px;
		color: var(--text-3);
		font-size: 14px;
		font-weight: 500;
		gap: 8px;
		user-select: none;
	`,
	emptyIcon: css`
		font-size: 28px;
		opacity: 0.6;
	`,
	onboardingWrap: css`
		padding: 22px 20px 18px;
	`,
	onboardingCount: css`
		color: var(--text-3);
		font-size: 12px;
		font-weight: 600;
		margin-bottom: 10px;
	`,
	onboardingTitle: css`
		color: var(--text);
		font-size: 24px;
		line-height: 1.2;
		margin: 0 0 10px;
	`,
	onboardingBody: css`
		color: var(--text-2);
		font-size: 14px;
		line-height: 1.5;
		margin: 0;
	`,
	onboardingDots: css`
		display: flex;
		gap: 8px;
		margin-top: 18px;
	`,
	dot: css`
		width: 8px;
		height: 8px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--border) 70%, transparent);
	`,
	dotActive: css`
		width: 20px;
		height: 8px;
		border-radius: 999px;
		background: var(--accent);
	`,
	onboardingActions: css`
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 20px;
		gap: 8px;
	`,
	onboardingNav: css`
		display: flex;
		gap: 8px;
	`,
	primaryButton: css`
		height: 34px;
		border: none;
		border-radius: 8px;
		padding: 0 12px;
		font-size: 13px;
		font-weight: 600;
		background: var(--accent);
		color: white;
		cursor: pointer;
	`,
	secondaryButton: css`
		height: 34px;
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 0 12px;
		font-size: 13px;
		font-weight: 600;
		background: transparent;
		color: var(--text-2);
		cursor: pointer;

		:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	`,
	buttonShortcut: css`
		display: inline-block;
		margin-left: 6px;
		padding: 0 6px;
		height: 18px;
		line-height: 18px;
		font-size: 11px;
		font-weight: 700;
		border-radius: 4px;
		border: 1px solid var(--border);
		background: color-mix(in srgb, var(--chip-bg) 85%, transparent);
		color: var(--chip-text);
	`,
};
