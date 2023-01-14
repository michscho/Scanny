export type Action = {
	title: string;
	desc: string;
	type: "action" | "bookmark" | "tab" | "history";
	action: string;
	emoji: boolean;
	emojiChar?: string;
	keycheck: boolean;
	favIconUrl?: string;
	keys?: string[];
	url?: string;
};

export const actionData: Action[] = [
	{
		title: "New tab",
		desc: "Open a new tab",
		type: "action",
		action: "new-tab",
		emoji: true,
		emojiChar: "✨",
		keycheck: true,
		keys: ["⌘", "T"],
	},
	{
		title: "Bookmark",
		desc: "Create a bookmark",
		type: "action",
		action: "create-bookmark",
		emoji: true,
		emojiChar: "📕",
		keycheck: true,
		keys: ["⌘", "D"],
	},
	//pinaction,
	{
		title: "Fullscreen",
		desc: "Make the page fullscreen",
		type: "action",
		action: "fullscreen",
		emoji: true,
		emojiChar: "🖥",
		keycheck: true,
		keys: ["⌘", "Ctrl", "F"],
	},
	//muteaction,
	{
		title: "Reload",
		desc: "Reload the page",
		type: "action",
		action: "reload",
		emoji: true,
		emojiChar: "♻️",
		keycheck: true,
		keys: ["⌘", "⇧", "R"],
	},
	{
		title: "Help",
		desc: "Get help with Omni on GitHub",
		type: "action",
		action: "url",
		url: "https://github.com/alyssaxuu/omni",
		emoji: true,
		emojiChar: "🤔",
		keycheck: false,
	},
	{
		title: "Compose email",
		desc: "Compose a new email",
		type: "action",
		action: "email",
		emoji: true,
		emojiChar: "✉️",
		keycheck: true,
		keys: ["⌥", "⇧", "C"],
	},
	{
		title: "Print page",
		desc: "Print the current page",
		type: "action",
		action: "print",
		emoji: true,
		emojiChar: "🖨️",
		keycheck: true,
		keys: ["⌘", "P"],
	},
	{
		title: "New Notion page",
		desc: "Create a new Notion page",
		type: "action",
		action: "url",
		url: "https://notion.new",
		emoji: false,
		favIconUrl: chrome.runtime.getURL("icons/logo-notion.png"),
		keycheck: false,
	},
	{
		title: "New Sheets spreadsheet",
		desc: "Create a new Google Sheets spreadsheet",
		type: "action",
		action: "url",
		url: "https://sheets.new",
		emoji: false,
		favIconUrl: chrome.runtime.getURL("icons/logo-sheets.png"),
		keycheck: false,
	},
	{
		title: "New Docs document",
		desc: "Create a new Google Docs document",
		type: "action",
		action: "url",
		emoji: false,
		url: "https://docs.new",
		favIconUrl: chrome.runtime.getURL("icons/logo-docs.png"),
		keycheck: false,
	},
	{
		title: "New Slides presentation",
		desc: "Create a new Google Slides presentation",
		type: "action",
		action: "url",
		url: "https://slides.new",
		emoji: false,
		favIconUrl: chrome.runtime.getURL("icons/logo-slides.png"),
		keycheck: false,
	},
	{
		title: "New form",
		desc: "Create a new Google Forms form",
		type: "action",
		action: "url",
		url: "https://forms.new",
		emoji: false,
		favIconUrl: chrome.runtime.getURL("icons/logo-forms.png"),
		keycheck: false,
	},
	{
		title: "New Medium story",
		desc: "Create a new Medium story",
		type: "action",
		action: "url",
		url: "https://story.new",
		emoji: false,
		favIconUrl: chrome.runtime.getURL("icons/logo-medium.png"),
		keycheck: false,
	},
	{
		title: "New GitHub repository",
		desc: "Create a new GitHub repository",
		type: "action",
		action: "url",
		url: "https://github.new",
		emoji: false,
		favIconUrl: chrome.runtime.getURL("icons/logo-github.png"),
		keycheck: false,
	},
	{
		title: "New GitHub gist",
		desc: "Create a new GitHub gist",
		type: "action",
		action: "url",
		url: "https://gist.new",
		emoji: false,
		favIconUrl: chrome.runtime.getURL("icons/logo-github.png"),
		keycheck: false,
	},
	{
		title: "New CodePen pen",
		desc: "Create a new CodePen pen",
		type: "action",
		action: "url",
		url: "https://pen.new",
		emoji: false,
		favIconUrl: chrome.runtime.getURL("icons/logo-codepen.png"),
		keycheck: false,
	},
	{
		title: "New Excel spreadsheet",
		desc: "Create a new Excel spreadsheet",
		type: "action",
		action: "url",
		url: "https://excel.new",
		emoji: false,
		favIconUrl: chrome.runtime.getURL("icons/logo-excel.png"),
		keycheck: false,
	},
	{
		title: "New PowerPoint presentation",
		desc: "Create a new PowerPoint presentation",
		type: "action",
		url: "https://powerpoint.new",
		action: "url",
		emoji: false,
		favIconUrl: chrome.runtime.getURL("icons/logo-powerpoint.png"),
		keycheck: false,
	},
	{
		title: "New Word document",
		desc: "Create a new Word document",
		type: "action",
		action: "url",
		url: "https://word.new",
		emoji: false,
		favIconUrl: chrome.runtime.getURL("icons/logo-word.png"),
		keycheck: false,
	},
	{
		title: "Create a whiteboard",
		desc: "Create a collaborative whiteboard",
		type: "action",
		action: "url",
		url: "https://whiteboard.new",
		emoji: true,
		emojiChar: "🧑‍🏫",
		keycheck: false,
	},
	{
		title: "Record a video",
		desc: "Record and edit a video",
		type: "action",
		action: "url",
		url: "https://recording.new",
		emoji: true,
		emojiChar: "📹",
		keycheck: false,
	},
	{
		title: "Create a Figma file",
		desc: "Create a new Figma file",
		type: "action",
		action: "url",
		url: "https://figma.new",
		emoji: false,
		favIconUrl: chrome.runtime.getURL("icons/logo-figma.png"),
		keycheck: false,
	},
	{
		title: "Create a FigJam file",
		desc: "Create a new FigJam file",
		type: "action",
		action: "url",
		url: "https://figjam.new",
		emoji: true,
		emojiChar: "🖌",
		keycheck: false,
	},
	{
		title: "Hunt a product",
		desc: "Submit a product to Product Hunt",
		type: "action",
		action: "url",
		url: "https://www.producthunt.com/posts/new",
		emoji: false,
		favIconUrl: chrome.runtime.getURL("icons/logo-producthunt.png"),
		keycheck: false,
	},
	{
		title: "Make a tweet",
		desc: "Make a tweet on Twitter",
		type: "action",
		action: "url",
		url: "https://twitter.com/intent/tweet",
		emoji: false,
		favIconUrl: chrome.runtime.getURL("icons/logo-twitter.png"),
		keycheck: false,
	},
	{
		title: "Create a playlist",
		desc: "Create a Spotify playlist",
		type: "action",
		action: "url",
		url: "https://playlist.new",
		emoji: false,
		favIconUrl: chrome.runtime.getURL("icons/logo-spotify.png"),
		keycheck: false,
	},
	{
		title: "Create a Canva design",
		desc: "Create a new design with Canva",
		type: "action",
		action: "url",
		url: "https://design.new",
		emoji: false,
		favIconUrl: chrome.runtime.getURL("icons/logo-canva.png"),
		keycheck: false,
	},
	{
		title: "Create a new podcast episode",
		desc: "Create a new podcast episode with Anchor",
		type: "action",
		action: "url",
		url: "https://episode.new",
		emoji: false,
		favIconUrl: chrome.runtime.getURL("icons/logo-anchor.png"),
		keycheck: false,
	},
	{
		title: "Edit an image",
		desc: "Edit an image with Adobe Photoshop",
		type: "action",
		action: "url",
		url: "https://photo.new",
		emoji: false,
		favIconUrl: chrome.runtime.getURL("icons/logo-photoshop.png"),
		keycheck: false,
	},
	{
		title: "Convert to PDF",
		desc: "Convert a file to PDF",
		type: "action",
		action: "url",
		url: "https://pdf.new",
		emoji: true,
		emojiChar: "📄",
		keycheck: false,
	},
	{
		title: "Scan a QR code",
		desc: "Scan a QR code with your camera",
		type: "action",
		action: "url",
		url: "https://scan.new",
		emoji: false,
		favIconUrl: chrome.runtime.getURL("icons/logo-qr.png"),
		keycheck: false,
	},
	{
		title: "Add a task to Asana",
		desc: "Create a new task in Asana",
		type: "action",
		action: "url",
		url: "https://task.new",
		emoji: false,
		favIconUrl: chrome.runtime.getURL("icons/logo-asana.png"),
		keycheck: false,
	},
	{
		title: "Add an issue to Linear",
		desc: "Create a new issue in Linear",
		type: "action",
		action: "url",
		url: "https://linear.new",
		emoji: false,
		favIconUrl: chrome.runtime.getURL("icons/logo-linear.png"),
		keycheck: false,
	},
	{
		title: "Add a task to WIP",
		desc: "Create a new task in WIP",
		type: "action",
		action: "url",
		url: "https://todo.new",
		emoji: false,
		favIconUrl: chrome.runtime.getURL("icons/logo-wip.png"),
		keycheck: false,
	},
	{
		title: "Create an event",
		desc: "Add an event to Google Calendar",
		type: "action",
		action: "url",
		url: "https://cal.new",
		emoji: false,
		favIconUrl: chrome.runtime.getURL("icons/logo-calendar.png"),
		keycheck: false,
	},
	{
		title: "Add a note",
		desc: "Add a note to Google Keep",
		type: "action",
		action: "url",
		emoji: false,
		url: "https://note.new",
		favIconUrl: chrome.runtime.getURL("icons/logo-keep.png"),
		keycheck: false,
	},
	{
		title: "New meeting",
		desc: "Start a Google Meet meeting",
		type: "action",
		action: "url",
		emoji: false,
		url: "https://meet.new",
		favIconUrl: chrome.runtime.getURL("icons/logo-meet.png"),
		keycheck: false,
	},
	{
		title: "Browsing history",
		desc: "Browse through your browsing history",
		type: "action",
		action: "history",
		emoji: true,
		emojiChar: "🗂",
		keycheck: true,
		keys: ["⌘", "Y"],
	},
	{
		title: "Incognito mode",
		desc: "Open an incognito window",
		type: "action",
		action: "incognito",
		emoji: true,
		emojiChar: "🕵️",
		keycheck: true,
		keys: ["⌘", "⇧", "N"],
	},
	{
		title: "Downloads",
		desc: "Browse through your downloads",
		type: "action",
		action: "downloads",
		emoji: true,
		emojiChar: "📦",
		keycheck: true,
		keys: ["⌘", "⇧", "J"],
	},
	{
		title: "Extensions",
		desc: "Manage your Chrome Extensions",
		type: "action",
		action: "extensions",
		emoji: true,
		emojiChar: "🧩",
		keycheck: false,
		keys: ["⌘", "D"],
	},
	{
		title: "Chrome settings",
		desc: "Open the Chrome settings",
		type: "action",
		action: "settings",
		emoji: true,
		emojiChar: "⚙️",
		keycheck: true,
		keys: ["⌘", ","],
	},
	{
		title: "Scroll to bottom",
		desc: "Scroll to the bottom of the page",
		type: "action",
		action: "scroll-bottom",
		emoji: true,
		emojiChar: "👇",
		keycheck: true,
		keys: ["⌘", "↓"],
	},
	{
		title: "Scroll to top",
		desc: "Scroll to the top of the page",
		type: "action",
		action: "scroll-top",
		emoji: true,
		emojiChar: "👆",
		keycheck: true,
		keys: ["⌘", "↑"],
	},
	{
		title: "Go back",
		desc: "Go back in history for the current tab",
		type: "action",
		action: "go-back",
		emoji: true,
		emojiChar: "👈",
		keycheck: true,
		keys: ["⌘", "←"],
	},
	{
		title: "Go forward",
		desc: "Go forward in history for the current tab",
		type: "action",
		action: "go-forward",
		emoji: true,
		emojiChar: "👉",
		keycheck: true,
		keys: ["⌘", "→"],
	},
	{
		title: "Duplicate tab",
		desc: "Make a copy of the current tab",
		type: "action",
		action: "duplicate-tab",
		emoji: true,
		emojiChar: "📋",
		keycheck: true,
		keys: ["⌥", "⇧", "D"],
	},
	{
		title: "Close tab",
		desc: "Close the current tab",
		type: "action",
		action: "close-tab",
		emoji: true,
		emojiChar: "🗑",
		keycheck: true,
		keys: ["⌘", "W"],
	},
	{
		title: "Close window",
		desc: "Close the current window",
		type: "action",
		action: "close-window",
		emoji: true,
		emojiChar: "💥",
		keycheck: true,
		keys: ["⌘", "⇧", "W"],
	},
	{
		title: "Manage browsing data",
		desc: "Manage your browsing data",
		type: "action",
		action: "manage-data",
		emoji: true,
		emojiChar: "🔬",
		keycheck: true,
		keys: ["⌘", "⇧", "Delete"],
	},
	{
		title: "Clear all browsing data",
		desc: "Clear all of your browsing data",
		type: "action",
		action: "remove-all",
		emoji: true,
		emojiChar: "🧹",
		keycheck: false,
		keys: ["⌘", "D"],
	},
	{
		title: "Clear browsing history",
		desc: "Clear all of your browsing history",
		type: "action",
		action: "remove-history",
		emoji: true,
		emojiChar: "🗂",
		keycheck: false,
		keys: ["⌘", "D"],
	},
	{
		title: "Clear cookies",
		desc: "Clear all cookies",
		type: "action",
		action: "remove-cookies",
		emoji: true,
		emojiChar: "🍪",
		keycheck: false,
		keys: ["⌘", "D"],
	},
	{
		title: "Clear cache",
		desc: "Clear the cache",
		type: "action",
		action: "remove-cache",
		emoji: true,
		emojiChar: "🗄",
		keycheck: false,
		keys: ["⌘", "D"],
	},
	{
		title: "Clear local storage",
		desc: "Clear the local storage",
		type: "action",
		action: "remove-local-storage",
		emoji: true,
		emojiChar: "📦",
		keycheck: false,
		keys: ["⌘", "D"],
	},
	{
		title: "Clear passwords",
		desc: "Clear all saved passwords",
		type: "action",
		action: "remove-passwords",
		emoji: true,
		emojiChar: "🔑",
		keycheck: false,
		keys: ["⌘", "D"],
	},
];