import { basicData } from "./pure-data/basic-data";
import { scrollData } from "./pure-data/scroll-data";
import { searchData } from "./pure-data/search-data";
import { tabData } from "./pure-data/tab-data";
import { urlData } from "./pure-data/url-data";

export function getActionsData() {
	return [
		...basicData,
		...searchData,
		...clearData,
		...tabData,
		...scrollData,
		...urlData,
	];
}
