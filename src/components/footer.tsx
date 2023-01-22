import { css } from "@emotion/react";

export interface FooterProps {
	result: number;
}

export function Footer(resultProps: FooterProps): JSX.Element {
	return (
		<div css={style}>
			<div css={resultStyle}>{resultProps.result} results</div>
			<div id="omni-arrows">
				Use arrow keys <span css={shortcut}>↑</span>
				<span css={shortcut}>↓</span> to navigate
			</div>
		</div>
	);
}

const style = css`
	height: 45px;
	line-height: 45px;
	border-top: 1px solid #35373e;
	width: 92%;
	margin-left: auto;
	margin-right: auto;
`;

const resultStyle = css`
	color: #a5a5ae;
	font-size: 12px;
	font-weight: 500;
	float: left;
`;

const shortcut = css`
	display: inline-block !important;
	font-size: 13px;
	border-radius: 5px;
	background-color: #383e4a;
	color: #f1f1f1;
	text-align: center;
	height: 20px;
	line-height: 20px;
	min-width: 20px;
	padding-left: 3px;
	padding-right: 3px;
`;
