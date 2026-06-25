import { escapeHtml } from "../utils/html.js";

const YEAR_FORCE_LABELS = {
  strong_favorable: "强顺：大运与流年同向借力",
  favorable_with_pressure: "整体偏顺：局部有压力",
  pressure_with_opportunity: "机会出现：底层承接不足",
  strong_pressure: "压力集中：宜全面收敛",
  mixed: "混合：边推进边调整",
};

const MONTH_RHYTHM_LABELS = {
  advance: "推进",
  wait: "等待",
  close: "收尾整理",
  adjust: "调整节奏",
  mixed: "边走边看",
};

export function renderYearFlowReport(report = {}) {
  const value = normalizeYear(report);
  const forceClass = Object.hasOwn(YEAR_FORCE_LABELS, value.forceAssessment.verdict)
    ? value.forceAssessment.verdict
    : "mixed";

  return `
    <div class="year-month-flow-report year-flow-report">
      <section class="year-month-flow-banner is-year">
        <span>流年（每1年一换）</span>
        <strong>事件触发层</strong>
        <p>${escapeHtml(value.overallJudgment || "本年触发主线待生成。")}</p>
      </section>

      <div class="year-month-flow-step-row year-flow-steps">
        ${renderYearStep("①", "叠加大运", value.luckOverlay, "大运背景与流年五行是同向、相生、相克还是混合？")}
        ${renderYearStep("②", "冲合原局", value.natalInteraction, "流年干支冲哪一柱、合哪一柱，哪些原局位置被触发？")}
        ${renderYearStep("③", "十神引动", value.tenGodActivation, "流年天干对日主是什么十神，今年哪个主题最容易显出来？")}
        ${renderForceStep(value.forceAssessment, forceClass)}
      </div>

      <section class="year-month-flow-note is-year">
        <b>流年只讲这一年在哪些领域有动静</b>
        <p>${escapeHtml(value.eventOutline.summary || "可以说事件轮廓、作用方向与需要注意的领域，但不把结果写死。")}</p>
        ${value.eventOutline.domains.length ? renderChips(value.eventOutline.domains) : ""}
        ${renderThreePartAdvice(value.eventOutline)}
      </section>

      <section class="year-force-matrix">
        <h4>力度叠加示意</h4>
        <div>
          ${renderMatrixItem("大运喜 + 流年喜", "顺风最强，适合主动推进", "strong_favorable")}
          ${renderMatrixItem("大运喜 + 流年忌", "整体可进，局部谨慎", "favorable_with_pressure")}
          ${renderMatrixItem("大运忌 + 流年喜", "有机会，但底层承接不足", "pressure_with_opportunity")}
          ${renderMatrixItem("大运忌 + 流年忌", "压力集中，宜收缩战线", "strong_pressure")}
        </div>
      </section>

      ${value.finalAdvice.length ? `
        <section class="year-month-flow-actions is-year">
          <h4>本年建议</h4>
          ${renderList(value.finalAdvice)}
        </section>
      ` : ""}

      ${value.verificationQuestions.length ? `
        <details class="year-month-flow-verification">
          <summary>现实验证点</summary>
          ${renderList(value.verificationQuestions)}
        </details>
      ` : ""}
    </div>
  `;
}

export function renderMonthFlowReport(report = {}) {
  const value = normalizeMonth(report);
  const rhythm = Object.hasOwn(MONTH_RHYTHM_LABELS, value.rhythmAssessment.mode)
    ? value.rhythmAssessment.mode
    : "mixed";

  return `
    <div class="year-month-flow-report month-flow-report">
      <section class="year-month-flow-banner is-month">
        <span>流月（每月一换）</span>
        <strong>节奏细化层</strong>
        <p>${escapeHtml(value.overallJudgment || "本月节奏主线待生成。")}</p>
      </section>

      <div class="year-month-flow-step-row month-flow-steps">
        ${renderMonthStep("①", "三层叠加", value.threeLayerOverlay, "大运底色 + 流年气场 + 流月五行")}
        ${renderRhythmStep(value.rhythmAssessment, rhythm)}
        ${renderMonthStep("③", "小触发点", value.localTrigger, "流月冲合原局哪一柱，只看局部触发")}
        ${renderMonthActionStep(value.actionAdvice)}
      </div>

      <section class="year-month-flow-note is-month">
        <b>流月不讲具体结果</b>
        <p>${escapeHtml(value.rhythmSummary || "只讲这个月的节奏感、局部触发和适合往哪里使力。")}</p>
      </section>

      <section class="three-layer-principle">
        <h4>三层叠加的关键原则</h4>
        <div>
          <article><b>大运</b><p>决定方向和基调，短期改变不了，只能顺势或逆势调整。</p></article>
          <article><b>流年</b><p>决定这一年哪些领域有动静，是大运背景下的事件触发层。</p></article>
          <article><b>流月</b><p>决定这件事在哪个月前后有动静，为行动节奏提供参考。</p></article>
        </div>
      </section>
    </div>
  `;
}

function renderYearStep(step, title, entry, helper) {
  return `
    <article class="year-month-flow-card is-year">
      <span>${escapeHtml(step)} ${escapeHtml(title)}</span>
      <h4>${escapeHtml(entry.title || title)}</h4>
      <small>${escapeHtml(helper)}</small>
      <p>${escapeHtml(entry.summary || "待生成。")}</p>
      ${entry.keyPoints.length ? renderList(entry.keyPoints) : ""}
    </article>
  `;
}

function renderForceStep(entry, forceClass) {
  return `
    <article class="year-month-flow-card is-year is-force is-${escapeHtml(forceClass)}">
      <span>④ 力度评价</span>
      <h4>${escapeHtml(entry.label || YEAR_FORCE_LABELS[forceClass])}</h4>
      <small>综合大运基调与流年触发，判断本年推进力度</small>
      <p>${escapeHtml(entry.summary || "本年力度待综合判断。")}</p>
      ${entry.basis.length ? renderList(entry.basis) : ""}
    </article>
  `;
}

function renderMonthStep(step, title, entry, helper) {
  return `
    <article class="year-month-flow-card is-month">
      <span>${escapeHtml(step)} ${escapeHtml(title)}</span>
      <h4>${escapeHtml(entry.title || title)}</h4>
      <small>${escapeHtml(helper)}</small>
      <p>${escapeHtml(entry.summary || "待生成。")}</p>
      ${entry.keyPoints.length ? renderList(entry.keyPoints) : ""}
    </article>
  `;
}

function renderRhythmStep(entry, rhythm) {
  return `
    <article class="year-month-flow-card is-month is-rhythm is-${escapeHtml(rhythm)}">
      <span>② 节奏判断</span>
      <h4>${escapeHtml(entry.label || MONTH_RHYTHM_LABELS[rhythm])}</h4>
      <small>判断本月更适合推进、等待、调整还是收尾</small>
      <p>${escapeHtml(entry.summary || "本月节奏待判断。")}</p>
    </article>
  `;
}

function renderMonthActionStep(action) {
  return `
    <article class="year-month-flow-card is-month is-action">
      <span>④ 行动建议</span>
      <h4>本月怎么用力</h4>
      ${renderActionBlock("适合做", action.do)}
      ${renderActionBlock("不宜做", action.avoid)}
      ${renderActionBlock("节奏拿法", action.pace)}
    </article>
  `;
}

function renderActionBlock(title, items) {
  const values = array(items);
  if (!values.length) return "";
  return `<div class="year-month-flow-action-block"><b>${escapeHtml(title)}</b><p>${escapeHtml(values.join("；"))}</p></div>`;
}

function renderThreePartAdvice(entry) {
  const blocks = [
    ["有利面", entry.positive],
    ["压力点", entry.risks],
    ["建议", entry.advice],
  ].filter(([, items]) => array(items).length);
  if (!blocks.length) return "";
  return `<div class="year-month-flow-three-part">${blocks.map(([title, items]) => `
    <section><b>${escapeHtml(title)}</b><p>${escapeHtml(array(items).join("；"))}</p></section>
  `).join("")}</div>`;
}

function renderMatrixItem(label, textValue, tone) {
  return `<article class="is-${escapeHtml(tone)}"><b>${escapeHtml(label)}</b><span>${escapeHtml(textValue)}</span></article>`;
}

function renderChips(items) {
  return `<div class="year-month-flow-chips">${array(items).map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>`;
}

function renderList(items) {
  const values = array(items);
  if (!values.length) return "";
  return `<ul>${values.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function normalizeYear(report) {
  const value = object(report);
  return {
    overallJudgment: text(value.overallJudgment),
    luckOverlay: normalizeStep(value.luckOverlay),
    natalInteraction: normalizeStep(value.natalInteraction),
    tenGodActivation: normalizeStep(value.tenGodActivation),
    forceAssessment: {
      verdict: text(value.forceAssessment?.verdict || "mixed"),
      label: text(value.forceAssessment?.label),
      summary: text(value.forceAssessment?.summary),
      basis: array(value.forceAssessment?.basis),
    },
    eventOutline: {
      summary: text(value.eventOutline?.summary),
      domains: array(value.eventOutline?.domains),
      positive: array(value.eventOutline?.positive),
      risks: array(value.eventOutline?.risks),
      advice: array(value.eventOutline?.advice),
    },
    finalAdvice: array(value.finalAdvice),
    verificationQuestions: array(value.verificationQuestions),
  };
}

function normalizeMonth(report) {
  const value = object(report);
  return {
    overallJudgment: text(value.overallJudgment),
    threeLayerOverlay: normalizeStep(value.threeLayerOverlay),
    rhythmAssessment: {
      mode: text(value.rhythmAssessment?.mode || "mixed"),
      label: text(value.rhythmAssessment?.label),
      summary: text(value.rhythmAssessment?.summary),
    },
    localTrigger: normalizeStep(value.localTrigger),
    actionAdvice: {
      do: array(value.actionAdvice?.do),
      avoid: array(value.actionAdvice?.avoid),
      pace: array(value.actionAdvice?.pace),
    },
    rhythmSummary: text(value.rhythmSummary),
  };
}

function normalizeStep(value) {
  const entry = object(value);
  return {
    title: text(entry.title),
    summary: text(entry.summary),
    keyPoints: array(entry.keyPoints),
  };
}

function object(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
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
