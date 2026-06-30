import { escapeHtml } from "../shared/html.js";
import {
  getShenshaMeaning,
  inferPillarKey,
} from "../domain/bazi/shensha/shenshaMeaningDatabase.js";

export function bindShenshaPopupEvents() {
  document
    .querySelectorAll(".shensha-chip")
    .forEach((button) => {
      button.addEventListener("click", () => {
        openShenshaPopup({
          name: button.dataset.shenshaName,
          pillar: button.dataset.shenshaPillar,
          source: button.dataset.shenshaSource,
          note: button.dataset.shenshaNote,
        });
      });
    });
}

function openShenshaPopup({
  name,
  pillar,
  source,
  note,
} = {}) {
  document
    .querySelector(".shensha-popup-backdrop")
    ?.remove();

  const pillarKey = inferPillarKey(pillar);
  const meaning = getShenshaMeaning(
    name,
    pillarKey,
  );

  const aliasText = meaning.aliases.length
    ? meaning.aliases.join("、")
    : "";

  const manifestationsHtml =
    meaning.manifestations.length
      ? `
        <ul class="shensha-meaning-list">
          ${meaning.manifestations
            .map(
              (item) =>
                `<li>${escapeHtml(item)}</li>`,
            )
            .join("")}
        </ul>
      `
      : `<p>具体表现需要结合原局结构继续判断。</p>`;

  const backdrop =
    document.createElement("div");

  backdrop.className =
    "shensha-popup-backdrop";

  backdrop.innerHTML = `
    <div
      class="shensha-popup"
      role="dialog"
      aria-modal="true"
      aria-label="${escapeHtml(
        name || "神煞说明",
      )}"
    >
      <div class="shensha-popup-head">
        <div>
          <p class="eyebrow">神煞说明</p>
          <h3>${escapeHtml(
            name || "未命名神煞",
          )}</h3>

          ${
            aliasText
              ? `<small>又称：${escapeHtml(
                  aliasText,
                )}</small>`
              : ""
          }
        </div>

        <button
          type="button"
          class="shensha-popup-close"
          aria-label="关闭"
        >×</button>
      </div>

      <div class="shensha-popup-body">
        <section>
          <h4>核心含义</h4>
          <p>${escapeHtml(
            meaning.definition,
          )}</p>
        </section>

        <section>
          <h4>常见表现</h4>
          ${manifestationsHtml}
        </section>

        ${
          meaning.pillarMeaning
            ? `
              <section>
                <h4>落柱含义</h4>
                <p>${escapeHtml(
                  meaning.pillarMeaning,
                )}</p>
              </section>
            `
            : ""
        }

        <section>
          <h4>本盘依据</h4>
          <p>
            <b>所在位置：</b>
            ${escapeHtml(pillar || "待查")}
          </p>

          <p>
            <b>查取方法：</b>
            ${escapeHtml(
              source ||
                "按传统神煞规则命中。",
            )}
          </p>
        </section>

        <section>
          <h4>注意事项</h4>
          <p>${escapeHtml(
            meaning.caution ||
              note ||
              "神煞不能单独定论。",
          )}</p>
        </section>
      </div>
    </div>
  `;

  backdrop.addEventListener(
    "click",
    (event) => {
      if (event.target === backdrop) {
        backdrop.remove();
      }
    },
  );

  backdrop
    .querySelector(".shensha-popup-close")
    ?.addEventListener("click", () => {
      backdrop.remove();
    });

  document.body.appendChild(backdrop);
}
