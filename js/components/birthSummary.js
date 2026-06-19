import { escapeHtml, joinParts } from "../utils/html.js";

export function renderBirthSummary(root, { input = {}, onEdit } = {}) {
  if (!root) return;

  root.innerHTML = `
    <div class="birth-summary-line">
      ${renderItem("姓名", input.name || "未填")}
      ${renderItem("性别", genderLabel(input.gender))}
      ${renderItem("出生时间", joinParts([input.birthDate, input.birthTime]))}
      ${renderItem("出生地", joinParts([input.birthProvince, input.birthplace]))}
      ${renderItem("目标", `${input.targetYear || "待查"}年${input.selectedMonth || "待查"}月`)}
      ${renderItem("真太阳时", input.trueSolarTime ? "是" : "否")}
    </div>
    <div class="birth-summary-actions">
      <button type="button" class="secondary" data-edit-birth>修改命盘</button>
    </div>
  `;

  root.querySelector("[data-edit-birth]")?.addEventListener("click", () => onEdit?.());
}

function renderItem(label, value) {
  return `
    <span>
      <b>${escapeHtml(label)}</b>
      <strong>${escapeHtml(value || "待查")}</strong>
    </span>
  `;
}

function genderLabel(value) {
  return { male: "男", female: "女", unknown: "未填" }[value] ?? value ?? "未填";
}
