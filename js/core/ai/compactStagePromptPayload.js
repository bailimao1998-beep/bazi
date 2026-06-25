export function compactFixedReportForPrompt(
  model,
) {
  if (
    !model ||
    typeof model !==
      "object"
  ) {
    return null;
  }

  const {
    stageRulePack:
      _stageRulePack,
    ...rest
  } = model;

  return rest;
}
