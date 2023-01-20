import React, { useEffect, useRef, useState } from "react";
import "../../public/content.css";
import { ActionComponent } from "./action-component";
import { FixedSizeList as List } from "react-window";
import $ from "jquery";
import { search } from "../search/search";
import { handleAction } from "../actions/handle-action";
import { Footer } from "./footer";
import { Action } from "../actions/data/types-data";
import { css } from "@emotion/react";
interface AppProps {
	actions: Action[];
}

export function App(searchProps: AppProps): JSX.Element {
	const [actions, setActions] = useState(searchProps.actions);

	useEffect(() => {
		$(document).on("keyup", ".omni-extension input", (e) =>
			search(e, searchProps.actions, setActions)
		);
		$(document).on("click", ".omni-item-active", (e) =>
			handleAction(e, actions)
		);
		$(document).on(
			"mouseover",
			".omni-extension .omni-item:not(.omni-item-active)",
			hoverItem
		);
	}, []);

	return <SearchApp actions={actions} />;
}

export function SearchApp(searchProps: AppProps): JSX.Element {
	const [activeIndex, setActiveIndex] = useState(0);
	const listRef = useRef<HTMLDivElement>(null);
	const reactLegacyRef = useRef<List<any>>(null);

	function scrollUp() {
		if (activeIndex >= 0) {
			console.log(activeIndex);

			setActiveIndex(activeIndex - 1);
			reactLegacyRef.current.scrollToItem(activeIndex, "start");
		}
	}

	function scrollDown() {
		if (activeIndex < searchProps.actions.length - 1) {
			setActiveIndex(activeIndex + 1);
			reactLegacyRef.current.scrollToItem(activeIndex, "start");
		}
	}

	useEffect(() => {
		function handleKeyUp(event: KeyboardEvent) {
			if (event.key === "ArrowUp") {
				scrollUp();
			}
		}
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "ArrowDown") {
				scrollDown();
			}

			if (event.key === "Enter") {
				handleAction(event, searchProps.actions);
			}
		}
		window.addEventListener("keyup", handleKeyUp);
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keyup", handleKeyUp);
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [activeIndex, scrollUp, scrollDown]);

	return (
		<div>
			<div css={styles.omniWrap}>
				<div id="omni">
					<div id="omni-search">
						<input css={styles.input} placeholder="Type a command or search" />
					</div>
					<div ref={listRef} id="omni-list">
						<List
							height={60 * 6}
							itemCount={searchProps.actions.length}
							itemSize={60}
							width={696}
							ref={reactLegacyRef}
						>
							{({ index, style }) => (
								<div
									key={index}
									style={style}
									className={`omni-item ${
										index === activeIndex ? "omni-item-active" : ""
									}`}
								>
									<ActionComponent
										action={searchProps.actions[index]}
										skip=""
										img=""
										index={index}
										keys=""
									/>
								</div>
							)}
						</List>
					</div>
					<Footer></Footer>
				</div>
			</div>
			<div css={styles.omniOverlay}></div>
			<Toast title="Test" />
		</div>
	);
}

export function hoverItem() {
	$(".omni-item-active").removeClass("omni-item-active");
	$(this).addClass("omni-item-active");
}

export function Toast(action: { title: string }) {
	const [show, setShow] = useState(true);

	setTimeout(() => {
		setShow(false);
	}, 3000);

	return (
		<div css={toastStyles.toast && show ? toastStyles.show : ""}>
			<span>{`${action.title} has been successfully performed`}</span>
		</div>
	);
}

const styles = {
	omniWrap: css`
		position: fixed;
		width: 700px;
		border: 1px solid transparent;
		border-radius: 5px;
		margin: auto;
		top: 0px;
		right: 0px;
		bottom: 0px;
		left: 0px;
		z-index: 9999999999;
		height: 540px;
		transition: all 0.2s cubic-bezier(0.05, 0.03, 0.35, 1);
		pointer-events: all;
	`,
	omniOverlay: css`
		height: 100%;
		width: 100%;
		position: fixed;
		top: 0px;
		left: 0px;
		background-color: #000;
		z-index: 9999;
		opacity: 0.2;
		transition: all 0.1s cubic-bezier(0.05, 0.03, 0.35, 1);
	`,
	input: css`
		background: transparent;
		border: 0px;
		outline: none;
		font-size: 20px;
		font-weight: 400;
		height: 50px;
		width: 92%;
		margin-left: auto;
		margin-right: auto;
		display: block;
		color: var(--text);
		caret-color: var(--text);
		font-family: Inter !important;
		margin-top: 5px;
		margin-bottom: 5px;
		box-sizing: border-box;
		outline: none;
		border: 0px;
		box-shadow: none;
	`,
};

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
