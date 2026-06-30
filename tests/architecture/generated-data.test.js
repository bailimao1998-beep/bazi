import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
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

test("runtime location catalog uses the sealed frontend entry only", () => {
  assert.doesNotThrow(() => {
    execFileSync(process.execPath, ["scripts/build-location-catalog.mjs", "--check"], {
      cwd: process.cwd(),
      stdio: "pipe",
    });
  });
});
