(function () {
  const { labels } = window.BaziEngine;

  function renderPillarCard(pillar) {
    return `<article class="pillar-card"><span>${pillar.role}</span><strong>${pillar.label}</strong><small>${labels.elements[pillar.stemElement]}干 · ${labels.elements[pillar.branchElement]}支</small></article>`;
  }

  function renderEnergyBars(energy) {
    const max = Math.max(1, ...Object.values(energy));
    return Object.entries(labels.elements)
      .map(([key, label]) => {
        const value = energy[key] ?? 0;
        return `<div class="energy-item"><div class="energy-label"><span>${label}</span><b>${formatEnergyValue(value)}</b></div><div class="bar"><i style="width:${Math.round((value / max) * 100)}%"></i></div></div>`;
      })
      .join("");
  }

  function formatEnergyValue(value) {
    const rounded = Math.round((Number(value) + Number.EPSILON) * 10) / 10;
    return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 1 }).format(rounded);
  }

  function renderSignal(signal) {
    const isActive = signal.status === "active";
    return `
      <article class="signal">
        <div><strong>${escapeHtml(signal.title)}</strong><span class="${isActive ? "badge" : "badge muted"}">${isActive ? "已验证" : "候选参考"}</span></div>
        <p>${escapeHtml(signal.description)}</p>
        <small>证据等级：${escapeHtml(signal.evidenceLevel ?? "derived")}</small>
      </article>
    `;
  }

  function renderMarkdownLite(text) {
    const html = escapeHtml(text)
      .split("\n")
      .map((line) => {
        if (line.startsWith("### ")) return `<h3>${line.slice(4)}</h3>`;
        if (line.startsWith("## ")) return `<h3>${line.slice(3)}</h3>`;
        if (line.startsWith("# ")) return `<h3>${line.slice(2)}</h3>`;
        if (line.startsWith("- ")) return `<p>• ${line.slice(2)}</p>`;
        return line.trim() ? `<p>${line}</p>` : "";
      })
      .join("");
    return html || "<p>本地模型没有返回内容。</p>";
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function groupBy(items, key) {
    return items.reduce((acc, item) => {
      const value = item[key] ?? "other";
      acc[value] = acc[value] ?? [];
      acc[value].push(item);
      return acc;
    }, {});
  }

  function categoryLabel(category) {
    return {
      element_season_strength: "月令五行强弱",
      twelve_growth_stage: "十二长生地势",
      branch_pair_relation: "地支两两关系",
      branch_group_relation: "地支成组关系",
      transit_branch_to_natal_branch: "岁运触发原局",
      transit_stem_to_daymaster: "流干作用日主",
      branch_hidden_combination: "暗合候选",
      remote_combination: "遥合候选",
      arched_combination: "拱合拱会候选",
    }[category] ?? category;
  }

  window.BaziShared = {
    renderPillarCard,
    renderEnergyBars,
    renderSignal,
    renderMarkdownLite,
    escapeHtml,
    groupBy,
    categoryLabel,
    labels,
  };
})();
