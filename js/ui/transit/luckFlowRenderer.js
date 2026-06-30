import { escapeHtml } from "../../shared/html.js";

const VERDICT_LABELS = {
  favorable: "顺运（借力）",
  mixed: "中性（调整）",
  pressure: "逆运（收敛）",
};

export function renderLuckFlowReport(report = {}) {
  const value = normalize(report);
  const verdictClass = ["favorable", "mixed", "pressure"].includes(value.assessment.verdict)
    ? value.assessment.verdict
    : "mixed";

  return `
    <div class="luck-flow-report">
      <section class="luck-flow-overview">
        <span>十年总断</span>
        <p>${escapeHtml(value.overallJudgment || "当前大运总断待生成。")}</p>
      </section>

      <div class="luck-flow-arrow" aria-hidden="true">↓</div>

      <section class="luck-flow-dual">
        ${renderPhaseCard(value.stemPhase, {
          step: "①",
          title: "天干前五年",
          tone: "stem",
          fallbackNote: "偏外显、偏主动、偏前段显现；不代表后段完全失效。",
        })}
        ${renderPhaseCard(value.branchPhase, {
          step: "②",
          title: "地支后五年",
          tone: "branch",
          fallbackNote: "偏内在、偏环境、偏后段落地；不代表前段完全不起作用。",
        })}
      </section>

      <div class="luck-flow-merge" aria-hidden="true"><span></span><b>↓</b><span></span></div>

      <section class="luck-flow-assessment is-${escapeHtml(verdictClass)}">
        <span>③ 判断这步大运对日主是喜还是忌</span>
        <h4>${escapeHtml(value.assessment.label || VERDICT_LABELS[verdictClass])}</h4>
        <p>${escapeHtml(value.assessment.summary || "综合判断待生成。")}</p>
        <div class="luck-flow-gain-cost">
          ${renderMiniList("可以获得", value.assessment.gains)}
          ${renderMiniList("需要付出", value.assessment.costs)}
        </div>
      </section>

      <div class="luck-flow-caption">展开讲三个方向</div>

      <section class="luck-flow-directions">
        ${renderDirectionCard("④", "事业 / 方向", value.directions.careerDirection, "career")}
        ${renderDirectionCard("⑤", "感情 / 关系", value.directions.relationship, "relationship")}
        ${renderDirectionCard("⑥", "健康 / 状态", value.directions.healthState, "health")}
      </section>

      <div class="luck-flow-arrow" aria-hidden="true">↓</div>

      <section class="luck-flow-action">
        <span>⑦ 给出这步大运的行动建议</span>
        <div class="luck-flow-action-grid">
          ${renderActionColumn("主动推进", value.actionAdvice.advance)}
          ${renderActionColumn("需要控制", value.actionAdvice.control)}
          ${renderActionColumn("暂不勉强", value.actionAdvice.avoidForNow)}
        </div>
      </section>

      <div class="luck-flow-arrow" aria-hidden="true">↓</div>

      <section class="luck-flow-transition">
        <span>⑧ 大运交接过渡期提示</span>
        <p>${escapeHtml(value.transition.summary || "换运交接提示待生成。")}</p>
        ${renderPlainList(value.transition.advice)}
      </section>

      ${value.verificationQuestions.length ? `
        <details class="luck-flow-verification">
          <summary>现实验证点</summary>
          ${renderPlainList(value.verificationQuestions)}
        </details>
      ` : ""}
    </div>
  `;
}

function renderPhaseCard(section, { step, title, tone, fallbackNote }) {
  return `
    <article class="luck-flow-card is-${escapeHtml(tone)}">
      <span>${escapeHtml(step)} ${escapeHtml(title)}</span>
      <h4>${escapeHtml(section.title || title)}</h4>
      <p>${escapeHtml(section.summary || "该部分待生成。")}</p>
      <small>${escapeHtml(section.phaseNote || fallbackNote)}</small>
      <div class="luck-flow-detail-grid">
        ${renderCompactDetail("有利面", section.positive)}
        ${renderCompactDetail("压力与代价", section.risks)}
        ${renderCompactDetail("建议", section.advice)}
      </div>
    </article>
  `;
}

function renderDirectionCard(step, title, entry, tone) {
  return `
    <article class="luck-flow-direction is-${escapeHtml(tone)}">
      <span>${escapeHtml(step)} ${escapeHtml(title)}</span>
      <p>${escapeHtml(entry.summary || "该方向暂未形成独立强象。")}</p>
      ${renderCompactDetail("有利面", entry.positive)}
      ${renderCompactDetail("压力点", entry.risks)}
      ${renderCompactDetail("建议", entry.advice)}
    </article>
  `;
}

function renderMiniList(title, items) {
  return `
    <section>
      <b>${escapeHtml(title)}</b>
      ${renderPlainList(items)}
    </section>
  `;
}

function renderCompactDetail(title, items) {
  const values = array(items);
  if (!values.length) return "";
  return `
    <div class="luck-flow-detail">
      <b>${escapeHtml(title)}</b>
      <p>${escapeHtml(values.join("；"))}</p>
    </div>
  `;
}

function renderActionColumn(title, items) {
  return `
    <section>
      <b>${escapeHtml(title)}</b>
      ${renderPlainList(items)}
    </section>
  `;
}

function renderPlainList(items) {
  const values = array(items);
  if (!values.length) return `<p class="luck-flow-empty">暂无独立结论。</p>`;
  return `<ul>${values.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function normalize(report) {
  const value = report && typeof report === "object" ? report : {};
  return {
    overallJudgment: text(value.overallJudgment),
    stemPhase: normalizeSection(value.stemPhase),
    branchPhase: normalizeSection(value.branchPhase),
    assessment: {
      verdict: text(value.assessment?.verdict),
      label: text(value.assessment?.label),
      summary: text(value.assessment?.summary),
      gains: array(value.assessment?.gains),
      costs: array(value.assessment?.costs),
    },
    directions: {
      careerDirection: normalizeDirection(value.directions?.careerDirection),
      relationship: normalizeDirection(value.directions?.relationship),
      healthState: normalizeDirection(value.directions?.healthState),
    },
    actionAdvice: {
      advance: array(value.actionAdvice?.advance),
      control: array(value.actionAdvice?.control),
      avoidForNow: array(value.actionAdvice?.avoidForNow),
    },
    transition: {
      summary: text(value.transition?.summary),
      advice: array(value.transition?.advice),
    },
    verificationQuestions: array(value.verificationQuestions),
  };
}

function normalizeSection(value) {
  const section = value && typeof value === "object" ? value : {};
  return {
    title: text(section.title),
    phaseNote: text(section.phaseNote),
    summary: text(section.summary),
    positive: array(section.positive),
    risks: array(section.risks),
    advice: array(section.advice),
  };
}

function normalizeDirection(value) {
  const entry = value && typeof value === "object" ? value : {};
  return {
    summary: text(entry.summary),
    positive: array(entry.positive),
    risks: array(entry.risks),
    advice: array(entry.advice),
  };
}

function text(value) {
  return value === undefined || value === null ? "" : String(value).trim();
}

function array(value) {
  return Array.isArray(value)
    ? value.map(text).filter(Boolean)
    : value === undefined || value === null || value === ""
      ? []
      : [text(value)].filter(Boolean);
}
