import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";

test("runtime generated data matches authoritative JSON", () => {
  assert.doesNotThrow(() => {
    execFileSync(process.execPath, ["scripts/build-imagery-rule-bundle.mjs", "--check"], {
      cwd: process.cwd(),
      stdio: "pipe",
    });
    execFileSync(process.execPath, ["scripts/build-location-catalog.mjs", "--check"], {
      cwd: process.cwd(),
      stdio: "pipe",
    });
  });
});

test("legacy and generated location catalogs stay byte-identical", () => {
  const legacy = readFileSync("js/locationData.js", "utf8");
  const generated = readFileSync("js/generated/locationCatalog.js", "utf8");
  assert.equal(generated, legacy);
});
