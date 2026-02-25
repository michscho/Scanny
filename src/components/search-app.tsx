import { css } from "@emotion/react";
import { useState, useRef, useEffect, MouseEvent } from "react";
import { ActionComponent } from "./action-component";
import { AppProps } from "./app";
import { Footer } from "./footer";
import { FixedSizeList, FixedSizeList as List } from "react-window";
import { search } from "../search/search";
import { handleActionItem } from "../actions/handle-action";
import { focusOnElement } from "../interactive/focus";

export function SearchApp(
	searchProps: AppProps & { setStatus: any }
): JSX.Element {
	const MAX_ROWS = 6;
	const ROW_HEIGHT = 64;
	const [activeIndex, setActiveIndex] = useState(0);
	const [actions, setActions] = useState(searchProps.actions);
	const [overlayOpacity, setOverlayOpacity] = useState(0.2);
	const [viewportWidth, setViewportWidth] = useState(
		typeof window === "undefined" ? 760 : window.innerWidth
	);
	const listRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const reactLegacyRef = useRef<List<any>>(null);

	useEffect(() => {
		const onResize = () => setViewportWidth(window.innerWidth);
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);

	if (inputRef.current?.value.startsWith(">")) {
		try {
			focusOnElement(actions[activeIndex]);
		} catch (error) {
			console.log(error);
		}
	}

	function scrollUp() {
		if (activeIndex > 0) {
			setActiveIndex(activeIndex - 1);
			reactLegacyRef.current?.scrollToItem(activeIndex - 1, "auto");
		}
	}

	function scrollDown() {
		if (activeIndex < actions.length - 1) {
			setActiveIndex(activeIndex + 1);
			reactLegacyRef.current?.scrollToItem(activeIndex + 1, "auto");
		}
	}

	function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "ArrowDown") {
			scrollDown();
			return;
		}

		if (event.key === "ArrowUp") {
			scrollUp();
			return;
		}

		if (event.key === "Enter") {
			const query = inputRef.current?.value || "";
			searchProps.setStatus("closed");
			handleActionItem(query, actions[activeIndex], event);
			return;
		}

		search(event, actions, setActions);
	}

	function handleMouseEnter(event: MouseEvent, index: number) {
		setActiveIndex(index);
	}

	const panelWidth = Math.min(760, Math.max(320, viewportWidth - 24));
	const listWidth = panelWidth - 4;
	const listHeight = Math.max(ROW_HEIGHT, Math.min(MAX_ROWS, actions.length) * ROW_HEIGHT);

	return (
		<div>
			<div css={styles.scannyWrap}>
				<div id="scanny" css={extension}>
					<div id="scanny-search" css={styles.searchBar}>
						<input
							ref={inputRef}
							css={styles.input}
							placeholder="Type a command or search"
							onKeyDown={(e) => handleKeyDown(e)}
						/>
					</div>
					<div ref={listRef} id="scanny-list">
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
									onMouseEnter={(e) => handleMouseEnter(e, index)}
									onMouseDown={(e) => {
										//handleAction(e, inputRef.current?.value, actions[index]);
									}}
								>
									<ActionComponent
										isSelected={index === activeIndex}
										action={actions[index]}
										skip=""
										img=""
										index={index}
										keys=""
									/>
								</div>
							)}
						</FixedSizeList>
					</div>
					<Footer result={actions.length} />
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

export function Toast(action: { title: string }) {
	const [show, setShow] = useState(true);

	console.log("toast", show);

	setTimeout(() => {
		setShow(false);
	}, 3000);

	return (
		<div css={[toastStyles.toast, toastStyles.show]}>
			<span>{`${action.title} has been successfully performed`}</span>
		</div>
	);
}

const toastStyles = {
	toast: css`
		text-align: center;
		font-family: Inter;
		font-weight: 500;
		font-size: 14px;
		position: fixed;
		width: fit-content;
		color: var(--text);
		bottom: 10px;
		left: 0px;
		right: 0px;
		margin: auto;
		background: var(--background);
		border-radius: 5px;
		height: 40px;
		line-height: 40px;
		display: block;
		padding-left: 10px;
		padding-right: 10px;
		visibility: hidden;
		opacity: 0;
		transition: all 0.2s cubic-bezier(0.05, 0.03, 0.35, 1);
		z-index: 99999999;
	`,
	img: css`
		display: inline-block;
		margin-right: 5px;
		vertical-align: middle;
		margin-bottom: 2px;
	`,
	show: css`
		bottom: 20px !important;
		opacity: 1 !important;
		visibility: visible !important;
	`,
};

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
};
