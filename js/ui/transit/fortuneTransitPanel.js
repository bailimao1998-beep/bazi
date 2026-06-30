import { renderTransitHierarchyPanel } from "./transitHierarchyPanel.js";
import { escapeHtml } from "../../shared/html.js";

let pendingRevealType = "";

const initializedRevealRoots =
  new WeakSet();

export function queueTransitReveal(type = "") {
  pendingRevealType = ["luck", "year", "month"].includes(type)
    ? type
    : "";
}

export function renderFortuneTransitPanel(root, payload = {}) {
  if (!root) return;
  const { state } = payload ?? {};
  if (!state?.baseBaziViewModel) {
    root.innerHTML = `
      <div class="plugin-header">
</div>
      <p class="muted">等待基础排盘后生成三排选择卡片。</p>
    `;
    return;
  }

  const luckItems = state.luckImageReport?.luckItems ?? [];
  const selectedTargetYear =
    Number(
      state.input?.targetYear,
    );
  const currentLuck =
    luckItems.find(
      (item) =>
        item.isCurrent,
    ) ??
    findLuckForYear(
      luckItems,
      selectedTargetYear,
    ) ??
    luckItems[0] ??
    {};
  const yearItem = state.yearImageReport?.yearItem ?? {};
  const monthItem = state.monthImageReport?.monthItem ?? {};
  const selectedYear = Number(yearItem.year ?? state.input?.targetYear);
  const selectedMonth = Number(monthItem.month ?? state.input?.selectedMonth ?? 1);
  const luckCycleInfo = state.chart?.luckCycles ?? {};
  const startNote = luckCycleInfo.startNote ?? "";
  const previousTransitScroll =
    captureTransitScrollPositions(root);

  root.innerHTML = `
    <section class="transit-selector-shell">
      <div class="plugin-header transit-selector-header">
        <div class="transit-selector-heading">
          <p class="eyebrow">岁运选择</p>
</div>
        ${startNote
          ? `<div class="transit-start-tip-wrap"><p class="transit-start-tip">${escapeHtml(startNote)}</p></div>`
          : `<div class="transit-start-tip-wrap" aria-hidden="true"></div>`}
        <span class="transit-context-pill">${escapeHtml(formatSelectionSummary(currentLuck, yearItem, monthItem))}</span>
      </div>
      ${renderTransitHierarchyPanel({
        state,
        currentLuck,
        selectedYear,
        selectedMonth,
      })}
          </section>
        `;

  bindTransitEvents(root, payload);

  const revealType =
    pendingRevealType;

  pendingRevealType = "";

  const isInitialReveal =
    !initializedRevealRoots.has(
      root,
    );

  if (isInitialReveal) {
    initializedRevealRoots.add(
      root,
    );
  }

  /*
  * 首次加载时定位三行。
  * 用户点击时只定位被点击的一行。
  * 普通重新渲染时不干涉手动滚动位置。
  */
  settleTransitScrollPositions(root, {
    previous: previousTransitScroll,
    revealType,
    centerAll: isInitialReveal,
  });
}

function bindTransitEvents(
  root,
  payload = {},
) {
  root
    .querySelectorAll(
      "[data-luck-year]",
    )
    .forEach(
      (button) => {
        button.addEventListener(
          "click",
          () => {
            queueTransitReveal("luck");

            payload.onSelectLuck?.({
              year:
                Number(
                  button.dataset
                    .luckYear,
                ),

              month:
                Number(
                  button.dataset
                    .luckMonth,
                ),
            });
          },
        );
      },
    );

  root
    .querySelectorAll(
      "[data-year-step]",
    )
    .forEach(
      (button) => {
        button.addEventListener(
          "click",
          () => {
            queueTransitReveal("year");

            payload.onSelectYear?.(
              Number(
                button.dataset
                  .yearStep,
              ),
            );
          },
        );
      },
    );

  root
    .querySelectorAll(
      "[data-month-select]",
    )
    .forEach(
      (button) => {
        button.addEventListener(
          "click",
          () => {
            queueTransitReveal("month");

            payload.onSelectMonth?.(
              Number(
                button.dataset
                  .monthSelect,
              ),
            );
          },
        );
      },
    );
}

function findLuckForYear(
  luckItems = [],
  targetYear,
) {
  const year =
    Number(targetYear);

  if (
    !Number.isFinite(
      year,
    )
  ) {
    return null;
  }

  return (
    (
      Array.isArray(
        luckItems,
      )
        ? luckItems
        : []
    )
      .find(
        (item) => {
          const years =
            String(
              item?.yearRange ??
              "",
            )
              .match(
                /\d{3,4}/g,
              )
              ?.map(
                Number,
              ) ??
            [];

          if (
            years.length < 2
          ) {
            return false;
          }

          return (
            year >= years[0] &&
            year <= years[1]
          );
        },
      ) ??
    null
  );
}

function formatSelectionSummary(currentLuck = {}, yearItem = {}, monthItem = {}) {
  return [
    currentLuck.ganZhi ? `大运 ${currentLuck.ganZhi}` : "",
    yearItem.year ? `${yearItem.year} ${yearItem.ganZhi || ""}` : "",
    monthItem.ganZhi
  ? [
      monthItem.dateRangeLabel ||
      (
        monthItem.branch
          ? `${monthItem.branch}月`
          : ""
      ),

      monthItem.ganZhi,
    ]
      .filter(Boolean)
      .join(" · ")
  : "",
  ].filter(Boolean).join(" · ") || "当前选择待查";
}

function transitRowType(list) {
  if (!list?.classList) return "";
  return ["luck", "year", "month"].find(
    (type) => list.classList.contains(`is-${type}-row`),
  ) || "";
}

function captureTransitScrollPositions(root) {
  const positions = {};
  if (!root) return positions;

  root.querySelectorAll(".transit-card-list").forEach((list) => {
    const type = transitRowType(list);
    if (type) positions[type] = Number(list.scrollLeft) || 0;
  });

  return positions;
}

function settleTransitScrollPositions(
  root,
  {
    previous = {},
    revealType = "",
    centerAll = false,
  } = {},
) {
  if (!root) return;

  /*
   * root.innerHTML 会重建三行 DOM，并把三行 scrollLeft 都重置为 0。
   * 在本次浏览器绘制前同步恢复未操作行，只对用户实际点击的行重新居中，
   * 因而点击流年不会带动大运，点击流月也不会带动大运和流年。
   */
  root.querySelectorAll(".transit-card-list").forEach((list) => {
    const type = transitRowType(list);
    const shouldCenter = centerAll || Boolean(revealType && type === revealType);

    if (shouldCenter) {
      centerActiveTransitCard(list);
      return;
    }

    if (type && Number.isFinite(Number(previous[type]))) {
      const maxLeft = Math.max(0, list.scrollWidth - list.clientWidth);
      list.scrollLeft = Math.min(
        maxLeft,
        Math.max(0, Math.round(Number(previous[type]))),
      );
    }
  });
}

function centerActiveTransitCard(list) {
  if (!list) return;

  const activeCard = list.querySelector(
    ".transit-select-card.is-active",
  );
  if (!activeCard) return;

  if (list.scrollWidth <= list.clientWidth + 1) {
    list.scrollLeft = 0;
    return;
  }

  const listRect = list.getBoundingClientRect();
  const cardRect = activeCard.getBoundingClientRect();
  const targetLeft =
    list.scrollLeft +
    (cardRect.left - listRect.left) -
    (list.clientWidth - cardRect.width) / 2;
  const maxLeft = Math.max(0, list.scrollWidth - list.clientWidth);

  list.scrollLeft = Math.min(
    maxLeft,
    Math.max(0, Math.round(targetLeft)),
  );
}

