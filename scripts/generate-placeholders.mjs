import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

// Minimal valid 2x2 JPEG (dark and light variants for before/after placeholders)
const darkJpeg = Buffer.from(
  "/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAACAAIDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q==",
  "base64"
);

const lightJpeg = Buffer.from(
  "/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAACAAIDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q==",
  "base64"
);

const portraitJpeg = darkJpeg;

const outDir = join(process.cwd(), "public", "results");
mkdirSync(outDir, { recursive: true });

for (let i = 1; i <= 12; i++) {
  writeFileSync(join(outDir, `${i}-before.jpg`), darkJpeg);
  writeFileSync(join(outDir, `${i}-after.jpg`), lightJpeg);
}

writeFileSync(join(process.cwd(), "public", "dr-ovardova.jpg"), portraitJpeg);
console.log("Generated placeholder images in public/results/ and public/dr-ovardova.jpg");
