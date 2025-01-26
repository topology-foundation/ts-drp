import { DRPNode } from "@ts-drp/node";
import { TextBuffer } from "./object/textBuffer";

const peerIdElement = <HTMLSpanElement>document.getElementById("peerId");
const dialableMultiaddrElement = <HTMLSpanElement>(
	document.getElementById("dialableMultiaddr")
);
const multiAddrList = <HTMLUListElement>(
	document.getElementById("multiAddrList")
);
const peersElement = <HTMLSpanElement>document.getElementById("peers");
const peersList = <HTMLUListElement>document.getElementById("peersList");
const discoveryPeersElement = <HTMLSpanElement>(
	document.getElementById("discoveryPeers")
);
const discoveryPeersList = <HTMLUListElement>(
	document.getElementById("discoveryPeersList")
);
const joinTextBufferButton = <HTMLButtonElement>(
	document.getElementById("joinTextBuffer")
);
const textBufferInput = <HTMLInputElement>(
	document.getElementById("textBufferInput")
);
const textBufferElement = <HTMLInputElement>(
	document.getElementById("textBuffer")
);
const valueSpan = <HTMLSpanElement>document.getElementById("value");
const selectionStartSpan = <HTMLSpanElement>(
	document.getElementById("selectionStart")
);
const selectionEndSpan = <HTMLSpanElement>(
	document.getElementById("selectionEnd")
);

let drpID = "";
let currentBuffer: TextBuffer | null = null;
let isRendering = false;
let cursorPosition = 0;

function renderPeerID(node: DRPNode) {
	peerIdElement.innerText = node.networkNode.peerId;
}

function renderDialableMultiaddr(node: DRPNode) {
	const multiaddr = node.networkNode.getMultiaddrs() || [];

	// Set up the count display and click handler
	dialableMultiaddrElement.innerText = `${multiaddr.length} addresses`;
	dialableMultiaddrElement.onclick = () => {
		multiAddrList.style.display =
			multiAddrList.style.display === "none" ? "block" : "none";
	};

	// Populate the list
	multiAddrList.innerHTML = "";
	for (const addr of multiaddr) {
		const li = document.createElement("li");
		li.innerText = addr;
		multiAddrList.appendChild(li);
	}
}

function renderPeers(node: DRPNode) {
	const peers = node.networkNode.getAllPeers();

	// Set up the count display and click handler
	peersElement.innerText = `${peers.length} peers`;
	peersElement.onclick = () => {
		peersList.style.display =
			peersList.style.display === "none" ? "block" : "none";
	};

	// Populate the list
	peersList.innerHTML = "";
	for (const peer of peers) {
		const li = document.createElement("li");
		li.innerText = peer;
		peersList.appendChild(li);
	}
}

function renderDiscoveryPeers(node: DRPNode) {
	if (!drpID) {
		discoveryPeersElement.innerText = "0 discovery peers";
		discoveryPeersList.innerHTML = "";
		return;
	}

	const discoveryPeers = node.networkNode.getGroupPeers(drpID);

	// Set up the count display and click handler
	discoveryPeersElement.innerText = `${discoveryPeers.length} discovery peers`;
	discoveryPeersElement.onclick = () => {
		discoveryPeersList.style.display =
			discoveryPeersList.style.display === "none" ? "block" : "none";
	};

	// Populate the list
	discoveryPeersList.innerHTML = "";
	for (const peer of discoveryPeers) {
		const li = document.createElement("li");
		li.innerText = peer;
		discoveryPeersList.appendChild(li);
	}
}

function getCaretPosition(element: HTMLDivElement) {
	const selection = window.getSelection();
	if (!selection || !selection.rangeCount) return { start: 0, end: 0 };

	const range = selection.getRangeAt(0);
	const preRange = range.cloneRange();
	preRange.selectNodeContents(element);
	preRange.setEnd(range.startContainer, range.startOffset);

	const start = preRange.toString().length;
	const end = start + range.toString().length;

	return { start, end };
}
let selectionStart = 0;
let selectionEnd = 0;
let wholeValue = "";
function updateInfo() {
	const text = textBufferElement.textContent; // Get the plain text value
	const { start, end } = getCaretPosition(textBufferElement);

	valueSpan.textContent = text;
	wholeValue = text || "";
	selectionStart = start;
	selectionEnd = end;
	selectionStartSpan.textContent = start.toString();
	selectionEndSpan.textContent = end.toString();
}

function renderTextBuffer() {
	if (!currentBuffer) {
		textBufferElement.innerHTML =
			'<div style="color: #666; text-align: center;">No text buffer loaded</div>';
		textBufferElement.contentEditable = "false";
		return;
	}

	if (isRendering) return;
	isRendering = true;

	textBufferElement.contentEditable = "true";
	const segments = currentBuffer.query_content();
	console.log("renderTextBuffer", segments);
	if (segments.length === 0) {
		textBufferElement.innerHTML = "";
		isRendering = false;
		return;
	}

	const content = segments
		.map(
			(segment) =>
				`<span style="color: ${segment.color};">${segment.content}</span>`,
		)
		.join("");

	// Only update if content has changed
	if (textBufferElement.innerHTML !== content) {
		textBufferElement.innerHTML = content;

		// Set cursor to tracked position
		const selection = window.getSelection();
		if (selection) {
			let currentPos = 0;
			let targetNode: Node | null = null;
			let targetOffset = 0;
			const walker = document.createTreeWalker(
				textBufferElement,
				NodeFilter.SHOW_TEXT,
				null,
			);
			let node = walker.nextNode();
			while (node) {
				const nodeLength = node.textContent?.length || 0;
				if (currentPos + nodeLength >= cursorPosition) {
					targetNode = node;
					targetOffset = cursorPosition - currentPos;
					break;
				}
				currentPos += nodeLength;
				node = walker.nextNode();
			}
			if (targetNode) {
				const range = document.createRange();
				range.setStart(targetNode, targetOffset);
				range.collapse(true);
				selection.removeAllRanges();
				selection.addRange(range);
			}
		}
	}
	isRendering = false;
}

function handleInput(node: DRPNode) {
	return (_event: Event): void => {
		updateInfo();
		if (!currentBuffer || isRendering) return;
		const old = currentBuffer.query_text();

		console.log(
			"handleInput old",
			old,
			wholeValue,
			textBufferElement.textContent,
		);
		if (old === wholeValue) return;

		// Calculate the differences and cursor position
		let start = 0;
		let end = 0;

		// Find unchanged text from the end
		while (
			end < old.length &&
			end < wholeValue.length - selectionEnd &&
			old[old.length - end - 1] === wholeValue[wholeValue.length - end - 1]
		)
			end++;

		// Find unchanged text from the start
		while (
			start + end < old.length &&
			start + end < wholeValue.length &&
			start < selectionStart &&
			old[start] === wholeValue[start]
		)
			start++;

		console.log("handleInput Start", start);
		console.log("handleInput End", end);
		console.log(
			"handleInput wholeValue.length",
			wholeValue.slice(start, wholeValue.length - end),
		);

		// Handle deletion if text was removed
		if (old.length > wholeValue.length) {
			const deleteStart = start;
			const deleteLength = old.length - wholeValue.length;
			currentBuffer.delete(deleteStart, deleteLength, node.networkNode.peerId);
			cursorPosition = start;
		}
		// Handle insertion if text was added
		else if (start + end < wholeValue.length) {
			const insertText = wholeValue.slice(start, wholeValue.length - end);
			currentBuffer.insert(start, insertText, node.networkNode.peerId);
			cursorPosition = start + insertText.length;
		}

		renderTextBuffer();
	};
}

// Update paste handler to account for cursor position
function setupTextBuffer(node: DRPNode) {
	textBufferElement.textContent = "";
	textBufferElement.addEventListener("input", handleInput(node));

	// Add keydown handler for delete and backspace
	textBufferElement.addEventListener("keydown", (e: KeyboardEvent) => {
		updateInfo();
		if (e.key === "Delete" || e.key === "Backspace") {
			const selection = window.getSelection();
			if (!selection || !currentBuffer) return;

			// If there's a selection range, delete the selected text
			if (selectionStart !== selectionEnd) {
				e.preventDefault();
				const deleteStart = Math.min(selectionStart, selectionEnd);
				const deleteLength = Math.abs(selectionEnd - selectionStart);
				currentBuffer.delete(
					deleteStart,
					deleteLength,
					node.networkNode.peerId,
				);
				cursorPosition = deleteStart;
				renderTextBuffer();
				return;
			}

			// Handle backspace
			if (e.key === "Backspace" && selectionStart > 0) {
				e.preventDefault();
				updateInfo();
				console.log(
					"Backspace",
					currentBuffer.query_text(),
					selectionEnd,
					selectionStart,
					Math.abs(selectionStart - selectionEnd),
				);
				currentBuffer.delete(
					Math.min(selectionStart - 1, selectionEnd - 1),
					Math.abs(selectionStart - selectionEnd) > 1
						? Math.abs(selectionStart - selectionEnd)
						: 1,
					node.networkNode.peerId,
				);
				cursorPosition = selectionStart - 1;
				renderTextBuffer();
				return;
			}

			// Handle delete
			if (
				e.key === "Delete" &&
				selectionStart < currentBuffer.query_text().length
			) {
				console.log("Delete", selectionStart);
				e.preventDefault();
				currentBuffer.delete(selectionStart, 1, node.networkNode.peerId);
				cursorPosition = selectionStart;
				renderTextBuffer();
				return;
			}
		}
	});

	textBufferElement.onpaste = (e) => {
		e.preventDefault();
		const text = e.clipboardData?.getData("text/plain") || "";
		if (currentBuffer && text) {
			// If there's a selection, delete it first
			if (selectionStart !== selectionEnd) {
				const deleteStart = Math.min(selectionStart, selectionEnd);
				const deleteLength = Math.abs(selectionEnd - selectionStart);
				currentBuffer.delete(
					deleteStart,
					deleteLength,
					node.networkNode.peerId,
				);
				cursorPosition = deleteStart;
			}
			currentBuffer.insert(cursorPosition, text, node.networkNode.peerId);
			cursorPosition += text.length;
			renderTextBuffer();
		}
	};

	// Add click handler to update cursor position
	textBufferElement.onclick = () => {
		updateInfo();
		const selection = window.getSelection();
		if (!selection || !selection.rangeCount) return;

		const range = selection.getRangeAt(0);
		let pos = 0;
		const walker = document.createTreeWalker(
			textBufferElement,
			NodeFilter.SHOW_TEXT,
			null,
		);

		let node = walker.nextNode();
		while (node && node !== range.startContainer) {
			if (node.textContent) pos += node.textContent.length;
			node = walker.nextNode();
		}

		if (node) {
			pos += range.startOffset;
			cursorPosition = pos;
		}
	};
}

async function joinHandler(node: DRPNode) {
	drpID = textBufferInput.value;
	if (!drpID) return;

	const drpObject = await node.createObject({
		drp: new TextBuffer(),
		id: drpID,
		sync: { enabled: true },
	});

	currentBuffer = drpObject.drp as TextBuffer;
	drpObject.subscribe(() => renderTextBuffer());
	renderTextBuffer();
}

async function main() {
	const node = new DRPNode({
		network_config: {
			bootstrap_peers: [
				"/ip4/51.15.224.211/tcp/50000/tls/sni/51-15-224-211.k51qzi5uqu5dh11pp1ei18eoc67g9ib9636d5pewz4o5z0gk8vknc92u9j5429.libp2p.direct/ws/p2p/12D3KooWC6sm9iwmYbeQJCJipKTRghmABNz1wnpJANvSMabvecwJ",
				//"/ip4/127.0.0.1/tcp/50000/ws/p2p/12D3KooWC6sm9iwmYbeQJCJipKTRghmABNz1wnpJANvSMabvecwJ",
			],
			browser_metrics: true,
		},
	});

	await node.start();
	await node.networkNode.isDiablable();

	renderPeerID(node);
	setInterval(() => {
		renderDialableMultiaddr(node);
		renderPeers(node);
		renderDiscoveryPeers(node);
	}, 1000);

	joinTextBufferButton.onclick = () => joinHandler(node);
	setupTextBuffer(node);
}

main().catch((e) => console.error("Error in main", e));
