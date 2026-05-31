import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";

test("birth settings refreshes the chart when date and time inputs change", async () => {
  const source = await fs.readFile(new URL("./birth-settings.global.js", import.meta.url), "utf8");

  assert.match(source, /const handleSolarYearChange[\s\S]*?updateReading\(\);[\s\S]*?};/);
  assert.match(source, /solarMonthInput\?\.addEventListener\("change"[\s\S]*?updateReading\(\);[\s\S]*?\}\);/);
  assert.match(source, /solarDayInput\?\.addEventListener\("change"[\s\S]*?updateReading\(\);[\s\S]*?\}\);/);
  assert.match(source, /lunarMonthInput\?\.addEventListener\("change"[\s\S]*?updateReading\(\);[\s\S]*?\}\);/);
  assert.match(source, /lunarDayInput\?\.addEventListener\("change"[\s\S]*?updateReading\(\);[\s\S]*?\}\);/);
  assert.match(source, /const timeInput = el\.birth\.querySelector\('input\[name="time"\]'\);[\s\S]*?timeInput\?\.addEventListener\("change"[\s\S]*?updateReading\(\);[\s\S]*?\}\);/);
});
