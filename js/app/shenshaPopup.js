import { escapeHtml } from "../utils/html.js";

export function bindShenshaPopupEvents() {
  document.querySelectorAll(".shensha-chip").forEach((button) => {
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

function openShenshaPopup({ name, pillar, source, note } = {}) {
  const old = document.querySelector(".shensha-popup-backdrop");
  old?.remove();

  const backdrop = document.createElement("div");
  backdrop.className = "shensha-popup-backdrop";
  backdrop.innerHTML = `
    <div class="shensha-popup" role="dialog" aria-modal="true" aria-label="${escapeHtml(name || "神煞说明")}">
      <div class="shensha-popup-head">
        <div>
          <p class="eyebrow">神煞说明</p>
          <h3>${escapeHtml(name || "未命名神煞")}</h3>
        </div>
        <button type="button" class="shensha-popup-close" aria-label="关闭">×</button>
      </div>

      <div class="shensha-popup-body">
        <p><b>位置：</b>${escapeHtml(pillar || "待查")}</p>
        <p><b>取象：</b>${escapeHtml(source || "按传统神煞规则命中。")}</p>
        <p><b>提示：</b>${escapeHtml(note || "需要结合柱位、十神、岁运继续验证。")}</p>
      </div>
    </div>
  `;

  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) backdrop.remove();
  });

  backdrop.querySelector(".shensha-popup-close")?.addEventListener("click", () => {
    backdrop.remove();
  });

  document.body.appendChild(backdrop);
}
