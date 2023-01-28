import { css } from "@emotion/react";
import { useState, useRef, useEffect, MouseEvent } from "react";
import { ActionComponent } from "./action-component";
import { AppProps } from "./app";
import { Footer } from "./footer";
import { FixedSizeList, FixedSizeList as List } from "react-window";
import { search } from "../search/search";
import { handleActionItem } from "../actions/handle-action";

export function SearchApp(searchProps: AppProps & {setStatus: any}): JSX.Element {
	const [activeIndex, setActiveIndex] = useState(0);
	const [actions, setActions] = useState(searchProps.actions);
	const listRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const reactLegacyRef = useRef<List<any>>(null);

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
			searchProps.setStatus("closed")
			handleActionItem(query, actions[activeIndex], event);
			return;
		}

		setActions(search(event, actions));
	}

	function handleMouseEnter(event: MouseEvent, index: number) {
		setActiveIndex(index);
	}

	return (
		<div>
			<div css={styles.scannyWrap}>
				<div id="scanny" css={extension}>
					<div id="scanny-search">
						<input
							ref={inputRef}
							css={styles.input}
							placeholder="Type a command or search"
							onKeyDown={(e) => handleKeyDown(e)}
						/>
					</div>
					<div ref={listRef} id="scanny-list">
						<FixedSizeList
							height={59 * 6}
							itemCount={actions.length}
							itemSize={60}
							width={696}
							ref={reactLegacyRef}
						>
							{({ index, style }) => (
								<div
									key={index}
									style={style}
									css={index === activeIndex && styles.active}
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
			<div css={styles.scannyOverlay}></div>
		</div>
	);
}


const extension = css`
	position: absolute;
	width: 100%;
	background: #281e1e9e;
	border: 1px solid #35373e;
	border-radius: 5px;
	top: 0px;
	left: 0px;
	z-index: 9999999998;
	height: fit-content;
	transition: all 0.2s cubic-bezier(0.05, 0.03, 0.35, 1);
	display: block;
`;

const styles = {
	active: css`
		background-color: var(--select);
		position: relative;
		:before {
			height: 100%;
			position: absolute;
			display: block;
			content: "";
			width: 2px;
			background-color: var(--accent);
		}
	`,
	scannyWrap: css`
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
	scannyOverlay: css`
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
