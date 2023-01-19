import React, { useEffect, useRef, useState } from "react";
import "../../public/content.css";
import { ActionComponent } from "./action-component";
import { Toast } from "./toast";
import { FixedSizeList as List } from "react-window";
import $ from "jquery";
import { search } from "../search/search";
import { handleAction } from "../actions/handle-action";
import { Footer } from "./footer";
import { Action } from "../actions/data/types-data";

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
		if (activeIndex > 0) {
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
			<div id="omni-wrap">
				<div id="omni">
					<div id="omni-search">
						<input placeholder="Type a command or search" />
					</div>
					<div ref={listRef} id="omni-list">
						<List
							height={400}
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
			<div id="omni-overlay"></div>
			<Toast />
		</div>
	);
}

export function hoverItem() {
	$(".omni-item-active").removeClass("omni-item-active");
	$(this).addClass("omni-item-active");
}

export function showToast(action: { title: string }) {
	$("#omni-extension-toast span").html(
		`"${action.title}" has been successfully performed`
	);
	$("#omni-extension-toast").addClass("omni-show-toast");
	setTimeout(() => {
		$(".omni-show-toast").removeClass("omni-show-toast");
	}, 3000);
}
