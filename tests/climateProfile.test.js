import test from "node:test";
import assert from "node:assert/strict";

import { buildClimateProfile } from "../js/core/natal/featureBuilders/buildClimateProfile.js";

test("winter climate creates warming and drying candidates without declaring auspiciousness", () => {
  const profile = buildClimateProfile({
    pillars: { month: { branch: "子" } },
    elements: { counts: { wood: 1, fire: 0, earth: 1, metal: 2, water: 4 } },
    structure: { monthCommand: { branch: "子", season: "winter" } },
  });

  assert.equal(profile.tendencies.temperature, "cold");
  assert.equal(profile.tendencies.moisture, "wet");
  assert.ok(profile.candidateElements.includes("fire"));
  assert.ok(profile.missingSupport.includes("fire"));
  assert.equal("favorableElements" in profile, false);
  assert.equal("good" in profile, false);
});

test("summer climate recognizes existing water as a cooling candidate", () => {
  const profile = buildClimateProfile({
    pillars: { month: { branch: "午" } },
    elements: { counts: { wood: 1, fire: 4, earth: 2, metal: 0, water: 1 } },
  });

  assert.equal(profile.tendencies.temperature, "warm");
  assert.ok(profile.priorityNeeds.some((item) => item.need === "cooling"));
  assert.ok(profile.existingSupport.includes("water"));
});

test("conflicting element pairs retain mediator availability only as a candidate", () => {
  const profile = buildClimateProfile({
    pillars: { month: { branch: "卯" } },
    elements: { counts: { wood: 3, fire: 0, earth: 3, metal: 0, water: 0 } },
  });

  const candidate = profile.passThroughCandidates.find((item) =>
    item.conflictElements.includes("wood") && item.conflictElements.includes("earth"),
  );
  assert.equal(candidate.mediatorElement, "fire");
  assert.equal(candidate.status, "missing");
  assert.equal("isResolved" in candidate, false);
});
