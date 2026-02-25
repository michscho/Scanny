import { basicData } from "./pure-data/basic-data";
import { clearData } from "./pure-data/clear-data";
import { helpData } from "./pure-data/help-data";
import { scrollData } from "./pure-data/scroll-data";
import { searchData } from "./pure-data/search-data";
import { tabData } from "./pure-data/tab-data";
import { urlData } from "./pure-data/url-data";
import { Action } from "./types-data";

export function getActionsData(): Action[] {
	return [
		...basicData,
		...searchData,
		...tabData,
		...scrollData,
		...urlData,
		...clearData,
		...helpData,
	];
}
