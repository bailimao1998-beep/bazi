import { renderTransitHierarchyPanel } from "./transitHierarchyPanel.js";
import { escapeHtml } from "../utils/html.js";

let pendingRevealType = "";

const initializedRevealRoots =
  new WeakSet();

export function renderFortuneTransitPanel(root, payload = {}) {
  if (!root) return;
  const { state } = payload ?? {};
  if (!state?.baseBaziViewModel) {
    root.innerHTML = `
      <div class="plugin-header">
        <h2>大运 / 流年 / 流月</h2>
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
    findLuckForYear(
      luckItems,
      selectedTargetYear,
    ) ??
    luckItems.find(
      (item) =>
        item.isCurrent,
    ) ??
    luckItems[0] ??
    {};
  const yearItem = state.yearImageReport?.yearItem ?? {};
  const monthItem = state.monthImageReport?.monthItem ?? {};
  const selectedYear = Number(yearItem.year ?? state.input?.targetYear);
  const selectedMonth = Number(monthItem.month ?? state.input?.selectedMonth ?? 1);
  const luckCycleInfo = state.chart?.luckCycles ?? {};
  const startNote = luckCycleInfo.startNote ?? "";

  root.innerHTML = `
    <section class="transit-selector-shell">
      <div class="plugin-header">
        <div>
          <p class="eyebrow">岁运选择</p>
          <h2>大运 / 流年 / 流月</h2>
        </div>
        <span class="transit-context-pill">${escapeHtml(formatSelectionSummary(currentLuck, yearItem, monthItem))}</span>
      </div>
      ${renderTransitHierarchyPanel({
        state,
        currentLuck,
        selectedYear,
        selectedMonth,
      })}

      ${startNote
        ? `<p class="fine-print transit-start-note">${escapeHtml(startNote)}</p>`
        : ""}
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
  if (
    revealType ||
    isInitialReveal
  ) {
    revealActiveTransitCards(
      root,
      revealType,
    );
  }
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
            pendingRevealType =
              "luck";

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
            pendingRevealType =
              "year";

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
            pendingRevealType =
              "month";

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

function revealActiveTransitCards(
  root,
  revealType = "",
) {
  if (!root) {
    return;
  }

  requestAnimationFrame(
    () => {
      requestAnimationFrame(
        () => {
          const selector =
            revealType
              ? `.transit-card-list.is-${revealType}-row`
              : ".transit-card-list";

          const lists =
            root.querySelectorAll(
              selector,
            );

          lists.forEach(
            (list) => {
              const activeCard =
                list.querySelector(
                  ".transit-select-card.is-active",
                );

              if (
                !activeCard ||
                list.scrollWidth <=
                  list.clientWidth
              ) {
                return;
              }

              const targetLeft =
                activeCard.offsetLeft -
                (
                  list.clientWidth -
                  activeCard.offsetWidth
                ) /
                  2;

              const maxLeft =
                Math.max(
                  0,
                  list.scrollWidth -
                    list.clientWidth,
                );

              const safeLeft =
                Math.min(
                  maxLeft,
                  Math.max(
                    0,
                    targetLeft,
                  ),
                );

              list.scrollTo({
                left:
                  safeLeft,

                behavior:
                  "auto",
              });
            },
          );
        },
      );
    },
  );
}
