//rss from "https://steamcommunity.com/groups/freegamesfinders/rss/";

function setLastGame(title) {
	console.log(title);
	chrome.storage.local.set({ lastGameTitle: title }).catch((err) => console.log(err));
}

function checkForNewGames() {
	chrome.storage.local
		.get('lastGameTitle')
		.then((title) => makeRequest(title.lastGameTitle || ''))
		.then((res) => {
			res[0].forEach((gameUrl) => {
				chrome.tabs.create({
					url: gameUrl,
				});
			});
			setLastGame(res[1]);
		});
}

async function makeRequest(lastGame = '') {
	const server = 'https://pipapi.onrender.com/freeGames?lastGame=' + lastGame;
	try {
		const res = await fetch(server);
		const data = await res.json();
		return data.games;
	} catch (err) {
		console.error(err);
	}
}

chrome.runtime.onInstalled.addListener(makeRequest().then((title) => setLastGame(title[1])));
chrome.runtime.onStartup.addListener(checkForNewGames);
