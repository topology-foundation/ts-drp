import { type Page, expect, test } from "@playwright/test";

const peersSelector = "#peers";
const peerIdSelector = "#peerIdExpanded";
const DRPIdInputSelector = "#gridInput";
const joinGridButtonSelector = "#joinGrid";
const objectPeersSelector = "#objectPeers";

async function getGlowingPeer(page: Page) {
	const divs = await page.$$("div");
	const glowingPeer = [];
	for (const div of divs) {
		const style = await div.getAttribute("style");
		if (!style) continue;

		const matchPeerID = style.match(/glow-([a-zA-Z0-9]+)/);
		if (!matchPeerID) continue;

		const matchLeft = style.match(/left: ([0-9]+)px/);
		const matchTop = style.match(/top: ([0-9]+)px/);
		if (!matchLeft || !matchTop) continue;

		glowingPeer.push({
			peerID: matchPeerID[1],
			left: Number.parseInt(matchLeft[1]),
			top: Number.parseInt(matchTop[1]),
		});
	}
	return glowingPeer;
}

test("should work with vite server", async ({ browser }) => {
	const page1 = await browser.newPage();
	const page2 = await browser.newPage();

	await page1.goto("/");
	await page2.goto("/");

	await expect(page1).toHaveTitle(/DRP - Grid/);
	await expect(page2).toHaveTitle(/DRP - Grid/);

	await expect(page1.locator(peerIdSelector)).not.toBeEmpty({ timeout: 10000 });
	await expect(page2.locator(peerIdSelector)).not.toBeEmpty({ timeout: 10000 });

	// now we have to wait for the browser node to
	const peerID1 = (
		(await (await page1.$(peerIdSelector))?.textContent()) || ""
	).trim();
	if (!peerID1) throw new Error("peerID1 is not defined");
	const peerID2 = (
		(await (await page2.$(peerIdSelector))?.textContent()) || ""
	).trim();
	if (!peerID2) throw new Error("peerID2 is not defined");

	const peers1Locator = page1.locator(peersSelector);
	const peers2Locator = page2.locator(peersSelector);

	await expect(peers1Locator).toContainText(peerID2, { timeout: 10000 });
	await expect(peers2Locator).toContainText(peerID1, { timeout: 10000 });

	const drpId = `test-drp-id-${Math.random().toString(36).substring(2, 15)}`;
	await page1.fill(DRPIdInputSelector, drpId);
	await page1.click(joinGridButtonSelector);
	await page2.fill(DRPIdInputSelector, drpId);
	await page2.click(joinGridButtonSelector);

	const objectPeers1Locator = page1.locator(objectPeersSelector);
	const objectPeers2Locator = page2.locator(objectPeersSelector);

	await expect(objectPeers1Locator).toContainText(peerID2, { timeout: 10000 });
	await expect(objectPeers2Locator).toContainText(peerID1, { timeout: 10000 });

	await expect(page1.locator(DRPIdInputSelector)).toHaveValue(drpId);
	await expect(page2.locator(DRPIdInputSelector)).toHaveValue(drpId);

	const glowingPeer = await getGlowingPeer(page1);
	expect(glowingPeer).toHaveLength(2);
	expect(glowingPeer.find((peer) => peer.peerID === peerID1)).toBeDefined();
	expect(glowingPeer.find((peer) => peer.peerID === peerID2)).toBeDefined();

	await page1.keyboard.press("w");
	await page2.keyboard.press("s");

	const movedPeer = await getGlowingPeer(page1);
	expect(Math.abs(movedPeer[0].top - glowingPeer[0].top)).toBeLessThan(100);
});
