import * as fs from "node:fs";

// One-line roast of a smart fridge, written for the Fridge Roast bounty.
// Gate: /output/entry.txt must be UTF-8 text of 1 to 200 characters,
// a single line, not only white space.
const MIN_CHARS = 1;
const MAX_CHARS = 200;

const ENTRY =
  "After last night's firmware update, my smart fridge's ice maker dispenses one cube at a time, slowly, like it's doing me a favor I didn't ask for.";

const OUT = "/output/entry.txt";

// Self-check gate: mirrors the sealed scorer (1-200 chars, one line, not blank).
function checkEntry(text: string): void {
  if (text.length < MIN_CHARS || text.length > MAX_CHARS) {
    throw new Error(
      `entry is ${text.length} characters, outside ${MIN_CHARS}-${MAX_CHARS}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

checkEntry(ENTRY);

fs.mkdirSync("/output", { recursive: true });
fs.writeFileSync(OUT, ENTRY, "utf8");

// Byte-for-byte read-back: the file on disk must be exactly the entry.
const readBack = fs.readFileSync(OUT);
if (!readBack.equals(Buffer.from(ENTRY, "utf8"))) {
  throw new Error("read-back mismatch: file bytes differ from entry");
}
console.log(`Wrote ${ENTRY.length} characters to ${OUT} (read-back verified)`);
