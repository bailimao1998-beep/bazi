import {
  formatLunarDate,
  formatLunarDay,
  formatSolarDateFromParts,
  getLunarMonthOptions,
  getSolarDayCount,
  lunarToSolar,
  parseSolarDateParts,
  solarToLunar,
} from "../../domain/bazi/calendar/lunarCalendar.js";
import {
  findLocation,
  getCitiesByProvince,
  getProvinceOptions,
} from "../../shared/locationCatalog.js";

export function renderBirthForm(root, { initialValue = {}, onSubmit, locationCatalog = { cities: [] } }) {
  if (!root) return;
  const lunar = solarToLunar(initialValue.birthDate ?? "1949-10-01");
  const state = {
    name: initialValue.name ?? "测试用户",
    calendarType: initialValue.calendarType ?? "solar",
    birthDate: initialValue.birthDate ?? "1949-10-01",
    lunarYear: initialValue.lunarYear ?? lunar.year,
    lunarMonth: initialValue.lunarMonth ?? lunar.month,
    lunarDay: initialValue.lunarDay ?? lunar.day,
    lunarLeapMonth: initialValue.lunarLeapMonth ?? lunar.isLeapMonth,
    birthTime: initialValue.birthTime ?? "00:00",
    gender: initialValue.gender ?? "male",
    birthProvince: initialValue.birthProvince ?? "北京市",
    birthplace: initialValue.birthplace ?? "北京",
    targetYear: initialValue.targetYear ?? 2026,
    selectedMonth: initialValue.selectedMonth ?? 1,
    trueSolarTime: Boolean(initialValue.trueSolarTime),
    preInterpretNatalAi: Boolean(initialValue.preInterpretNatalAi),
    preInterpretYearAi: Boolean(
      initialValue.preInterpretYearAi ??
      initialValue.preInterpretAi
    ),
    error: "",
  };

  function rerender({ submit = false } = {}) {
    syncLocation(state, locationCatalog);
    syncCalendar(state);
    root.innerHTML = renderForm(state, locationCatalog);
    bind(root, state, rerender, locationCatalog);
    if (submit) onSubmit(toPayload(state, locationCatalog));
  }

  function bind(container, formState, update, locationCatalog) {
    container.querySelectorAll('input[name="calendarType"]').forEach((control) => {
      control.addEventListener("change", (event) => {
        formState.calendarType = event.currentTarget.value;
        formState.error = "";
        update({ submit: true });
      });
    });
    container.querySelector("[name='name']")?.addEventListener("change", (event) => {
      formState.name = event.currentTarget.value;
      update({ submit: true });
    });
    container.querySelector("[name='solarYear']")?.addEventListener("change", (event) => {
      const current = parseSolarDateParts(formState.birthDate);
      updateFromSolarParts(formState, { ...current, year: Number(event.currentTarget.value) });
      update({ submit: true });
    });
    container.querySelector("[name='solarMonth']")?.addEventListener("change", (event) => {
      const current = parseSolarDateParts(formState.birthDate);
      updateFromSolarParts(formState, { ...current, month: Number(event.currentTarget.value) });
      update({ submit: true });
    });
    container.querySelector("[name='solarDay']")?.addEventListener("change", (event) => {
      const current = parseSolarDateParts(formState.birthDate);
      updateFromSolarParts(formState, { ...current, day: Number(event.currentTarget.value) });
      update({ submit: true });
    });
    container.querySelector("[name='lunarYear']")?.addEventListener("change", (event) => {
      formState.lunarYear = Number(event.currentTarget.value);
      updateFromLunarParts(formState);
      update({ submit: true });
    });
    container.querySelector("[name='lunarMonth']")?.addEventListener("change", (event) => {
      const [month, leap] = event.currentTarget.value.split("|");
      formState.lunarMonth = Number(month);
      formState.lunarLeapMonth = leap === "1";
      updateFromLunarParts(formState);
      update({ submit: true });
    });
    container.querySelector("[name='lunarDay']")?.addEventListener("change", (event) => {
      formState.lunarDay = Number(event.currentTarget.value);
      updateFromLunarParts(formState);
      update({ submit: true });
    });
    ["gender", "targetYear"].forEach((name) => {
      container.querySelector(`[name='${name}']`)?.addEventListener("change", (event) => {
        formState[name] = ["targetYear"].includes(name)
          ? Number(event.currentTarget.value)
          : event.currentTarget.value;
        update({ submit: true });
      });
    });

    ["birthHour", "birthMinute"].forEach((name) => {
      container.querySelector(`[name='${name}']`)?.addEventListener("change", () => {
        const hour = container.querySelector("[name='birthHour']")?.value;
        const minute = container.querySelector("[name='birthMinute']")?.value;
        formState.birthTime = formatBirthTime(hour, minute);
        update({ submit: true });
      });
    });

    container.querySelector("[name='birthProvince']")?.addEventListener("change", (event) => {
      formState.birthProvince = event.currentTarget.value;
      const cities = getCitiesByProvince(locationCatalog, formState.birthProvince);
      formState.birthplace = cities[0]?.name || cities[0]?.city || "";
      update({ submit: true });
    });

    container.querySelector("[name='birthplace']")?.addEventListener("change", (event) => {
      formState.birthplace = event.currentTarget.value;
      update({ submit: true });
    });
    container.querySelector("[name='trueSolarTime']")?.addEventListener("change", (event) => {
      formState.trueSolarTime = event.currentTarget.checked;
      update({ submit: true });
    });
    ["preInterpretNatalAi", "preInterpretYearAi"].forEach((name) => {
      container.querySelector(`[name='${name}']`)?.addEventListener("change", (event) => {
        formState[name] = event.currentTarget.checked;
        update({ submit: false });
      });
    });
    container.querySelector("form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      onSubmit(toPayload(formState, locationCatalog));
    });
  }

  rerender();
}

function renderForm(state, locationCatalog) {
  const solar = parseSolarDateParts(state.birthDate);
  const solarDays = getSolarDayCount(solar.year, solar.month);
  const lunarMonths = getLunarMonthOptions(state.lunarYear);
  const selectedLunarMonth = lunarMonths.find((month) => month.value === state.lunarMonth && month.isLeapMonth === Boolean(state.lunarLeapMonth)) ?? lunarMonths[0];
  const lunarDays = selectedLunarMonth?.days ?? 30;
  const provinceOptions = getProvinceOptions(locationCatalog);
  const cities = getCitiesByProvince(locationCatalog, state.birthProvince);
  const city = findLocation(locationCatalog, {
    birthProvince: state.birthProvince,
    birthplace: state.birthplace,
  });
  const birthTime = splitBirthTime(state.birthTime);
  return `
    <div class="birth-form-heading">
      <p class="eyebrow">命盘设置</p>
</div>
    <form class="birth-form birth-form-compact birth-form-main-grid">
      <div class="birth-toolbar-row birth-toolbar-main">
        <label class="field-name birth-field-name"><span>姓名</span><input name="name" value="${escapeHtml(state.name)}" /></label>
        <label class="field-gender birth-field-gender">
          <span>性别</span>
          <select name="gender">
            <option value="female" ${state.gender === "female" ? "selected" : ""}>女命</option>
            <option value="male" ${state.gender === "male" ? "selected" : ""}>男命</option>
            <option value="unknown" ${state.gender === "unknown" ? "selected" : ""}>不指定</option>
          </select>
        </label>
        <div class="birth-control-field field-calendar-type birth-field-calendar">
          <span class="birth-control-label">历法</span>
          <div class="calendar-tabs" role="radiogroup" aria-label="选择日期历法">
            ${renderCalendarTab("solar", "公历", state.calendarType)}
            ${renderCalendarTab("lunar", "农历", state.calendarType)}
          </div>
        </div>
        ${state.calendarType === "lunar" ? renderLunarControls(state, lunarMonths, lunarDays) : renderSolarControls(solar, solarDays)}
        <label class="field-time birth-field-time">
          <span>出生时间</span>
          <div class="birth-time-control time-inline-fields">
            <select name="birthHour" aria-label="出生小时">${rangeTimeOptions(23, birthTime.hour, "时")}</select>
            <select name="birthMinute" aria-label="出生分钟">${rangeTimeOptions(59, birthTime.minute, "分")}</select>
            <small class="time-hour-label">${escapeHtml(getChineseHourLabel(state.birthTime))}</small>
          </div>
        </label>
        <div class="birth-control-field birth-option-field field-true-solar">
          <span class="birth-control-label">时间校正</span>
          <label class="compact-switch-row"><input name="trueSolarTime" type="checkbox" ${state.trueSolarTime ? "checked" : ""} /> <span>真太阳时</span></label>
        </div>
      </div>

      <div class="birth-toolbar-row birth-toolbar-secondary">
        <label class="field-province birth-field-province">
          <span>出生省份</span>
          <select name="birthProvince">
            ${provinceOptions.map((province) => `
              <option value="${escapeHtml(province)}" ${province === state.birthProvince ? "selected" : ""}>
                ${escapeHtml(province)}
              </option>
            `).join("")}
          </select>
        </label>
        <label class="field-city birth-field-city">
          <span>出生城市 / 区县</span>
          <select name="birthplace">
            ${cities.map((item) => `
              <option value="${escapeHtml(item.name)}" ${item.name === state.birthplace ? "selected" : ""}>
                ${escapeHtml(item.displayName || item.fullName || item.name)}
              </option>
            `).join("")}
          </select>
        </label>
        <label class="field-target-year birth-field-year"><span>解读年份</span><input name="targetYear" type="number" value="${state.targetYear}" /></label>
        <div class="birth-control-field field-pre-ai birth-pre-ai-field">
          <span class="birth-control-label">AI预解读</span>
          <div class="birth-pre-ai-options">
            <label class="compact-switch-row"><input name="preInterpretNatalAi" type="checkbox" ${state.preInterpretNatalAi ? "checked" : ""} /> <span>原局预解读</span></label>
            <label class="compact-switch-row"><input name="preInterpretYearAi" type="checkbox" ${state.preInterpretYearAi ? "checked" : ""} /> <span>流年预解读</span></label>
          </div>
        </div>
        <button type="submit" class="field-submit is-start-chart">开始排盘</button>
      </div>

      <div class="birth-toolbar-row birth-toolbar-tips birth-form-hint-row">
        <p class="calendar-preview birth-form-inline-row">${escapeHtml(`公历 ${state.birthDate} · ${formatLunarDate({
          year: state.lunarYear,
          month: state.lunarMonth,
          day: state.lunarDay,
          isLeapMonth: state.lunarLeapMonth,
        })}`)}</p>
        <p class="location-preview birth-form-inline-row">${escapeHtml(renderLocationPreview(city, state.trueSolarTime, state))}</p>
      </div>
    </form>
    ${state.error ? `<p class="form-error">${escapeHtml(state.error)}</p>` : ""}
    <p class="fine-print">农历换算支持 1900-2100 年；节气、真太阳时和晚子时由本地代码参与排盘。</p>
  `;
}

function renderCalendarTab(value, label, selected) {
  return `
    <label class="${selected === value ? "is-active" : ""}">
      <input type="radio" name="calendarType" value="${value}" ${selected === value ? "checked" : ""} />
      <span>${label}</span>
    </label>
  `;
}

function renderSolarControls(solar, dayCount) {
  return `
    <div class="date-inline-fields calendar-date-grid field-date birth-field-date">
      <label><span>公历年份</span><input type="number" name="solarYear" min="1900" max="2100" value="${solar.year}" required /></label>
      <label><span>公历月份</span><select name="solarMonth">${rangeOptions(12, solar.month, "月")}</select></label>
      <label><span>公历日期</span><select name="solarDay">${rangeOptions(dayCount, solar.day, "日")}</select></label>
    </div>
  `;
}

function renderLunarControls(state, months, dayCount) {
  const selectedKey = `${state.lunarMonth}|${state.lunarLeapMonth ? "1" : "0"}`;
  return `
    <div class="date-inline-fields calendar-date-grid field-date birth-field-date">
      <label><span>农历年份</span><input type="number" name="lunarYear" min="1900" max="2100" value="${state.lunarYear}" required /></label>
      <label>
        <span>农历月份</span>
        <select name="lunarMonth">
          ${months.map((month) => {
            const key = `${month.value}|${month.isLeapMonth ? "1" : "0"}`;
            return `<option value="${key}" ${key === selectedKey ? "selected" : ""}>${month.label}</option>`;
          }).join("")}
        </select>
      </label>
      <label>
        <span>农历日期</span>
        <select name="lunarDay">
          ${Array.from({ length: dayCount }, (_, index) => {
            const day = index + 1;
            return `<option value="${day}" ${day === state.lunarDay ? "selected" : ""}>${formatLunarDay(day)}</option>`;
          }).join("")}
        </select>
      </label>
    </div>
  `;
}

function rangeOptions(count, selected, suffix) {
  return Array.from({ length: count }, (_, index) => {
    const value = index + 1;
    return `<option value="${value}" ${Number(selected) === value ? "selected" : ""}>${value}${suffix}</option>`;
  }).join("");
}

function rangeTimeOptions(max, selected, suffix) {
  return Array.from({ length: max + 1 }, (_, value) => {
    const label = String(value).padStart(2, "0");
    return `<option value="${label}" ${String(selected).padStart(2, "0") === label ? "selected" : ""}>${label} ${suffix}</option>`;
  }).join("");
}

function splitBirthTime(value = "00:00") {
  const [hour = "00", minute = "00"] = String(value || "00:00").split(":");
  return {
    hour: normalizeTimePart(hour, 23),
    minute: normalizeTimePart(minute, 59),
  };
}

function formatBirthTime(hour, minute) {
  return `${normalizeTimePart(hour, 23)}:${normalizeTimePart(minute, 59)}`;
}

function normalizeTimePart(value, max) {
  const number = Math.min(max, Math.max(0, Math.trunc(Number(value))));
  return String(Number.isFinite(number) ? number : 0).padStart(2, "0");
}

function getChineseHourLabel(time = "00:00") {
  const { hour } = splitBirthTime(time);
  const value = Number(hour);
  if (value === 23 || value === 0) return "子时";
  if (value < 3) return "丑时";
  if (value < 5) return "寅时";
  if (value < 7) return "卯时";
  if (value < 9) return "辰时";
  if (value < 11) return "巳时";
  if (value < 13) return "午时";
  if (value < 15) return "未时";
  if (value < 17) return "申时";
  if (value < 19) return "酉时";
  if (value < 21) return "戌时";
  return "亥时";
}

function updateFromSolarParts(state, parts) {
  try {
    state.birthDate = formatSolarDateFromParts(parts);
    const lunar = solarToLunar(state.birthDate);
    state.lunarYear = lunar.year;
    state.lunarMonth = lunar.month;
    state.lunarDay = lunar.day;
    state.lunarLeapMonth = lunar.isLeapMonth;
    state.error = "";
  } catch (error) {
    state.error = error.message || "日期换算失败，请检查输入。";
  }
}

function updateFromLunarParts(state) {
  try {
    const options = getLunarMonthOptions(state.lunarYear);
    const selected = options.find((month) => month.value === state.lunarMonth && month.isLeapMonth === Boolean(state.lunarLeapMonth)) ?? options[0];
    state.lunarMonth = selected.value;
    state.lunarLeapMonth = selected.isLeapMonth;
    state.lunarDay = Math.min(Math.max(Number(state.lunarDay) || 1, 1), selected.days);
    state.birthDate = lunarToSolar({
      year: state.lunarYear,
      month: state.lunarMonth,
      day: state.lunarDay,
      isLeapMonth: state.lunarLeapMonth,
    });
    state.error = "";
  } catch (error) {
    state.error = error.message || "日期换算失败，请检查输入。";
  }
}

function syncCalendar(state) {
  if (state.calendarType === "lunar") updateFromLunarParts(state);
  else updateFromSolarParts(state, parseSolarDateParts(state.birthDate));
}
function syncLocation(state, locationCatalog) {
  const provinces = getProvinceOptions(locationCatalog);
  const currentProvince = String(state.birthProvince || "").trim();

  const matchedProvince = provinces.find((province) => {
    return province === currentProvince ||
      province.includes(currentProvince) ||
      currentProvince.includes(province);
  });

  if (!matchedProvince) {
    state.birthProvince = provinces[0] || "北京市";
  } else {
    state.birthProvince = matchedProvince;
  }

  const cities = getCitiesByProvince(locationCatalog, state.birthProvince);
  const matchedLocation = findLocation(locationCatalog, {
    birthProvince: state.birthProvince,
    birthplace: state.birthplace,
  });

  if (!matchedLocation) {
    state.birthplace = cities[0]?.name || cities[0]?.city || "";
  } else {
    state.birthplace = matchedLocation.name;
  }
}

function toPayload(state, locationCatalog) {
  const location = findLocation(locationCatalog, {
    birthProvince: state.birthProvince,
    birthplace: state.birthplace,
  });

  return {
    name: state.name,
    calendarType: state.calendarType,
    birthDate: state.birthDate,
    lunarYear: state.lunarYear,
    lunarMonth: state.lunarMonth,
    lunarDay: state.lunarDay,
    lunarLeapMonth: state.lunarLeapMonth,
    birthTime: state.birthTime,
    gender: state.gender,
    birthProvince: state.birthProvince,
    birthplace: state.birthplace,
    birthLongitude: location?.longitude ?? null,
    birthLatitude: location?.latitude ?? null,
    standardMeridian: location?.standardMeridian ?? 120,
    targetYear: Number(state.targetYear),
    selectedMonth: Number(state.selectedMonth),
    trueSolarTime: Boolean(state.trueSolarTime),
    preInterpretNatalAi: Boolean(state.preInterpretNatalAi),
    preInterpretYearAi: Boolean(state.preInterpretYearAi),
    // 保留旧字段作为流年预解读兼容别名。
    preInterpretAi: Boolean(state.preInterpretYearAi),
  };
}

function renderLocationPreview(city, trueSolarTime, state = {}) {
  if (!city || !Number.isFinite(Number(city.longitude))) {
    return "出生地未匹配经纬度，真太阳时不会应用。";
  }

  const birthParts = parsePreviewBirthParts(state);
  const longitudeCorrection = (Number(city.longitude) - Number(city.standardMeridian ?? 120)) * 4;
  const equationOfTime = birthParts ? calculatePreviewEquationOfTime(birthParts) : 0;
  const totalCorrection = longitudeCorrection + equationOfTime;
  const corrected = birthParts ? applyPreviewCorrection(birthParts, totalCorrection) : "";

  const locationName = city.fullName || city.displayName || city.name;
  const baseText = `${locationName}：经度${Number(city.longitude).toFixed(4)}，纬度${Number(city.latitude).toFixed(4)}`;

  if (!trueSolarTime) {
    return `${baseText}；勾选真太阳时后，会按“经度校正 + 均时差”校正。预计经度校正约${formatSignedMinutes(longitudeCorrection)}，均时差约${formatSignedMinutes(equationOfTime)}，最终校正约${formatSignedMinutes(totalCorrection)}。`;
  }

  return `${baseText}；经度校正约${formatSignedMinutes(longitudeCorrection)}，均时差约${formatSignedMinutes(equationOfTime)}，最终校正约${formatSignedMinutes(totalCorrection)}；校正后约为${corrected}，会参与排盘。`;
}

function parsePreviewBirthParts(state = {}) {
  const [year, month, day] = String(state.birthDate || "").split("-").map(Number);
  const [hour, minute] = String(state.birthTime || "00:00").split(":").map(Number);

  if (![year, month, day, hour].every(Number.isFinite)) return null;

  return {
    year,
    month,
    day,
    hour,
    minute: Number.isFinite(minute) ? minute : 0,
  };
}

function calculatePreviewEquationOfTime(parts) {
  const dayOfYear = getPreviewDayOfYear(parts);
  const b = (2 * Math.PI * (dayOfYear - 81)) / 364;
  return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
}

function getPreviewDayOfYear(parts) {
  const start = Date.UTC(parts.year, 0, 0);
  const current = Date.UTC(parts.year, parts.month - 1, parts.day);
  return Math.floor((current - start) / 86400000);
}

function applyPreviewCorrection(parts, correctionMinutes) {
  const utc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute) + correctionMinutes * 60000;
  const adjusted = new Date(utc);

  return `${adjusted.getUTCFullYear()}-${String(adjusted.getUTCMonth() + 1).padStart(2, "0")}-${String(adjusted.getUTCDate()).padStart(2, "0")} ${String(adjusted.getUTCHours()).padStart(2, "0")}:${String(adjusted.getUTCMinutes()).padStart(2, "0")}`;
}

function formatSignedMinutes(value) {
  const rounded = Math.round(Number(value) || 0);
  return `${rounded > 0 ? "+" : ""}${rounded}分钟`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
