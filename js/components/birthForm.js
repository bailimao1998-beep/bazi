import {
  formatLunarDate,
  formatLunarDay,
  formatSolarDateFromParts,
  getLunarMonthOptions,
  getSolarDayCount,
  lunarToSolar,
  parseSolarDateParts,
  solarToLunar,
} from "../lunarCalendar.js";
import {
  findLocation,
  getCitiesByProvince,
  getProvinceOptions,
} from "../core/location/locationCatalogClient.js";

const commonCities = [
  { name: "北京", longitude: 116.4074, latitude: 39.9042, standardMeridian: 120 },
  { name: "上海", longitude: 121.4737, latitude: 31.2304, standardMeridian: 120 },
  { name: "广州", longitude: 113.2644, latitude: 23.1291, standardMeridian: 120 },
  { name: "深圳", longitude: 114.0579, latitude: 22.5431, standardMeridian: 120 },
  { name: "成都", longitude: 104.0665, latitude: 30.5728, standardMeridian: 120 },
  { name: "乌鲁木齐", longitude: 87.6168, latitude: 43.8256, standardMeridian: 120 },
  { name: "定州", longitude: 114.9902, latitude: 38.5162, standardMeridian: 120 },
];

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
    birthProvince: initialValue.birthProvince ?? "北京",
    birthplace: initialValue.birthplace ?? "北京",
    targetYear: initialValue.targetYear ?? 2026,
    selectedMonth: initialValue.selectedMonth ?? 1,
    trueSolarTime: Boolean(initialValue.trueSolarTime),
    preInterpretAi: Boolean(initialValue.preInterpretAi),
    error: "",
  };

  function rerender({ submit = false } = {}) {
    syncLocation(state, locationCatalog);
    syncCalendar(state);
    root.innerHTML = renderForm(state, locationCatalog);
    bind(root, state, rerender, locationCatalog);
    if (submit) onSubmit(toPayload(state));
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
    ["birthTime", "gender", "targetYear"].forEach((name) => {
      container.querySelector("[name='birthProvince']")?.addEventListener("change", (event) => {
        formState.birthProvince = event.currentTarget.value;
        const cities = getCitiesByProvince(locationCatalog, formState.birthProvince);
        formState.birthplace = cities[0]?.city || "";
        update({ submit: true });
      });
      container.querySelector("[name='birthplace']")?.addEventListener("change", (event) => {
        formState.birthplace = event.currentTarget.value;
        update({ submit: true });
      });
      container.querySelector(`[name='${name}']`)?.addEventListener("change", (event) => {
        formState[name] = ["targetYear"].includes(name) ? Number(event.currentTarget.value) : event.currentTarget.value;
        update({ submit: true });
      });
    });
    container.querySelector("[name='trueSolarTime']")?.addEventListener("change", (event) => {
      formState.trueSolarTime = event.currentTarget.checked;
      update({ submit: true });
    });
    container.querySelector("[name='preInterpretAi']")?.addEventListener("change", (event) => {
      formState.preInterpretAi = event.currentTarget.checked;
      update({ submit: true });
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
  return `
    <div class="plugin-header">
      <p class="eyebrow">命盘设置</p>
      <h2>出生信息</h2>
    </div>
    <form class="birth-form">
      <label><span>姓名</span><input name="name" value="${escapeHtml(state.name)}" /></label>
      <div class="calendar-tabs" role="radiogroup" aria-label="选择日期历法">
        ${renderCalendarTab("solar", "公历", state.calendarType)}
        ${renderCalendarTab("lunar", "农历", state.calendarType)}
      </div>
      ${state.calendarType === "lunar" ? renderLunarControls(state, lunarMonths, lunarDays) : renderSolarControls(solar, solarDays)}
      <p class="calendar-preview">${escapeHtml(`公历 ${state.birthDate} · ${formatLunarDate({
        year: state.lunarYear,
        month: state.lunarMonth,
        day: state.lunarDay,
        isLeapMonth: state.lunarLeapMonth,
      })}`)}</p>
      <label><span>出生时间</span><input name="birthTime" type="time" value="${escapeHtml(state.birthTime)}" required /></label>
      <label>
        <span>性别</span>
        <select name="gender">
          <option value="female" ${state.gender === "female" ? "selected" : ""}>女命</option>
          <option value="male" ${state.gender === "male" ? "selected" : ""}>男命</option>
          <option value="unknown" ${state.gender === "unknown" ? "selected" : ""}>不指定</option>
        </select>
      </label>
      <label>
        <span>出生省份</span>
        <select name="birthProvince">
          ${provinceOptions.map((province) => `
            <option value="${escapeHtml(province)}" ${province === state.birthProvince ? "selected" : ""}>
              ${escapeHtml(province)}
            </option>
          `).join("")}
        </select>
      </label>

      <label>
        <span>出生城市 / 区县</span>
        <select name="birthplace">
          ${cities.map((item) => `
            <option value="${escapeHtml(item.city)}" ${item.city === state.birthplace ? "selected" : ""}>
              ${escapeHtml(item.fullName || item.city)}
            </option>
          `).join("")}
        </select>
      </label>

      <p class="location-preview">${escapeHtml(renderLocationPreview(city, state.trueSolarTime))}</p>
      <label class="switch-row"><input name="trueSolarTime" type="checkbox" ${state.trueSolarTime ? "checked" : ""} /> <span>按真太阳时校正</span></label>
      <label><span>解读年份</span><input name="targetYear" type="number" value="${state.targetYear}" /></label>
      <label class="switch-row"><input name="preInterpretAi" type="checkbox" ${state.preInterpretAi ? "checked" : ""} /> <span>AI 预先解读</span></label>
      <button type="submit">重新排盘</button>
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
    <div class="calendar-date-grid">
      <label><span>公历年份</span><input type="number" name="solarYear" min="1900" max="2100" value="${solar.year}" required /></label>
      <label><span>公历月份</span><select name="solarMonth">${rangeOptions(12, solar.month, "月")}</select></label>
      <label><span>公历日期</span><select name="solarDay">${rangeOptions(dayCount, solar.day, "日")}</select></label>
    </div>
  `;
}

function renderLunarControls(state, months, dayCount) {
  const selectedKey = `${state.lunarMonth}|${state.lunarLeapMonth ? "1" : "0"}`;
  return `
    <div class="calendar-date-grid">
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

  if (!provinces.includes(state.birthProvince)) {
    state.birthProvince = provinces[0] || "北京";
  }

  const cities = getCitiesByProvince(locationCatalog, state.birthProvince);

  if (!cities.some((item) => item.city === state.birthplace)) {
    state.birthplace = cities[0]?.city || state.birthplace || "";
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
    preInterpretAi: Boolean(state.preInterpretAi),
  };
}

function renderLocationPreview(city, trueSolarTime) {
  if (!city || !Number.isFinite(Number(city.longitude))) {
    return "出生地未匹配经纬度，真太阳时不会应用。";
  }

  const longitudeCorrection = Math.round(
    (Number(city.longitude) - Number(city.standardMeridian ?? 120)) * 4
  );

  return `${city.fullName || city.name}：经度${Number(city.longitude).toFixed(4)}，纬度${Number(city.latitude).toFixed(4)}；${
    trueSolarTime
      ? `经度校正约${longitudeCorrection}分钟，会参与排盘。`
      : "勾选真太阳时后会按此地校正。"
  }`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
