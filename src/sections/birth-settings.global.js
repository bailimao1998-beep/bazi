(function () {
  const { escapeHtml } = window.BaziShared;
  const { formatLunarDate, getLunarMonthOptions, lunarToSolar, solarToLunar } = window.BaziCalendar;

  function renderBirthSettings({ state, el, updateReading }) {
    syncCalendarState(state);
    const calendarType = state.calendarType === "lunar" ? "lunar" : "solar";
    const solar = parseSolarDateParts(state.date);
    const solarDayCount = getSolarDayCount(solar.year, solar.month);
    const monthOptions = getLunarMonthOptions(state.lunarYear);
    const selectedMonthKey = `${state.lunarMonth}-${Boolean(state.lunarLeapMonth)}`;
    const selectedMonth = monthOptions.find((month) => `${month.value}-${month.isLeapMonth}` === selectedMonthKey) ?? monthOptions[0];
    const dayCount = selectedMonth?.days ?? 30;
    const provinceOptions = buildProvinceOptions(state);
    state.birthProvince = normalizeBirthProvince(state, provinceOptions);
    const cityOptions = buildCityOptions(state);
    const selectedCity = cityOptions.find((city) => city.name === state.birthplace);
    el.birth.innerHTML = `
      <div class="plugin-header">
        <p class="eyebrow">命盘设置</p>
        <h2 id="birth-input-title">出生信息</h2>
      </div>
      <form id="birthForm" class="birth-form">
        <div class="calendar-tabs" role="radiogroup" aria-label="选择日期历法">
          <label class="${calendarType === "solar" ? "is-active" : ""}">
            <input type="radio" name="calendarType" value="solar" ${calendarType === "solar" ? "checked" : ""} />
            <span>公历</span>
          </label>
          <label class="${calendarType === "lunar" ? "is-active" : ""}">
            <input type="radio" name="calendarType" value="lunar" ${calendarType === "lunar" ? "checked" : ""} />
            <span>农历</span>
          </label>
        </div>
        ${
          calendarType === "solar"
            ? `<div class="calendar-date-grid">
                <label><span>公历年份</span><input type="number" name="solarYear" min="1900" max="2100" value="${solar.year}" required /></label>
                <label>
                  <span>公历月份</span>
                  <select name="solarMonth">
                    ${Array.from({ length: 12 }, (_, index) => `<option value="${index + 1}" ${solar.month === index + 1 ? "selected" : ""}>${index + 1}月</option>`).join("")}
                  </select>
                </label>
                <label>
                  <span>公历日期</span>
                  <select name="solarDay">
                    ${Array.from({ length: solarDayCount }, (_, index) => `<option value="${index + 1}" ${solar.day === index + 1 ? "selected" : ""}>${index + 1}日</option>`).join("")}
                  </select>
                </label>
              </div>`
            : `<div class="calendar-date-grid">
                <label><span>农历年份</span><input type="number" name="lunarYear" min="1900" max="2100" value="${state.lunarYear}" required /></label>
                <label>
                  <span>农历月份</span>
                  <select name="lunarMonth">
                    ${monthOptions.map((month) => `<option value="${month.value}|${month.isLeapMonth ? "1" : "0"}" ${`${month.value}-${month.isLeapMonth}` === selectedMonthKey ? "selected" : ""}>${month.label}</option>`).join("")}
                  </select>
                </label>
                <label>
                  <span>农历日期</span>
                  <select name="lunarDay">
                    ${Array.from({ length: dayCount }, (_, index) => `<option value="${index + 1}" ${state.lunarDay === index + 1 ? "selected" : ""}>${formatLunarDayLabel(index + 1)}</option>`).join("")}
                  </select>
                </label>
              </div>`
        }
        <p class="calendar-preview">${escapeHtml(renderCalendarPreview(state))}</p>
        <label><span>出生时间</span><input type="time" name="time" value="${state.time}" required /></label>
        <label>
          <span>性别</span>
          <select name="gender">
            <option value="male" ${state.gender === "male" ? "selected" : ""}>男命</option>
            <option value="female" ${state.gender === "female" ? "selected" : ""}>女命</option>
          </select>
        </label>
        <label>
          <span>出生省份</span>
          <select name="birthProvince">
            ${provinceOptions.map((province) => `<option value="${escapeHtml(province)}" ${province === state.birthProvince ? "selected" : ""}>${escapeHtml(formatProvinceName(province))}</option>`).join("")}
          </select>
        </label>
        <label>
          <span>出生城市 / 区县</span>
          <select name="birthplace">
            ${cityOptions.map((city) => `<option value="${escapeHtml(city.name)}" ${city.name === state.birthplace ? "selected" : ""}>${escapeHtml(city.displayName ?? city.name)}</option>`).join("")}
          </select>
        </label>
        <p class="location-preview">${escapeHtml(renderLocationPreview(selectedCity, state.trueSolarTime))}</p>
        <label class="switch-row">
          <input type="checkbox" name="trueSolarTime" ${state.trueSolarTime ? "checked" : ""} />
          <span>按真太阳时校正</span>
        </label>
        <button type="submit">重新排盘</button>
      </form>
      ${state.birthInputError ? `<p class="form-error">${escapeHtml(state.birthInputError)}</p>` : ""}
      <p class="fine-print">当前已展示专业命盘字段；农历换算支持 1900-2100 年，节气与真太阳时为近似提示。</p>
    `;
    el.birth.querySelectorAll('input[name="calendarType"]').forEach((control) => {
      control.addEventListener("change", (event) => {
        state.calendarType = event.currentTarget.value;
        state.birthInputError = "";
        updateReading();
      });
    });
    const solarYearInput = el.birth.querySelector('input[name="solarYear"]');
    const handleSolarYearChange = (event) => {
      const year = Number(event.currentTarget.value);
      if (!Number.isInteger(year) || year < 1900 || year > 2100) {
        state.birthInputError = "公历年份需在 1900-2100 之间。";
        return;
      }
      const current = parseSolarDateParts(state.date);
      updateLunarPreviewFromSolar(state, {
        year,
        month: current.month,
        day: current.day,
      });
      updateReading();
    };
    solarYearInput?.addEventListener("input", handleSolarYearChange);
    solarYearInput?.addEventListener("change", handleSolarYearChange);
    const solarMonthInput = el.birth.querySelector('select[name="solarMonth"]');
    solarMonthInput?.addEventListener("change", (event) => {
      const current = parseSolarDateParts(state.date);
      updateLunarPreviewFromSolar(state, {
        year: current.year,
        month: Number(event.currentTarget.value),
        day: current.day,
      });
      updateReading();
    });
    const solarDayInput = el.birth.querySelector('select[name="solarDay"]');
    solarDayInput?.addEventListener("change", (event) => {
      const current = parseSolarDateParts(state.date);
      updateLunarPreviewFromSolar(state, {
        year: current.year,
        month: current.month,
        day: Number(event.currentTarget.value),
      });
      updateReading();
    });
    const lunarYearInput = el.birth.querySelector('input[name="lunarYear"]');
    const handleLunarYearChange = (event) => {
      const year = Number(event.currentTarget.value);
      if (!Number.isInteger(year) || year < 1900 || year > 2100) {
        state.birthInputError = "农历年份需在 1900-2100 之间。";
        return;
      }
      state.lunarYear = year;
      ensureValidLunarSelection(state);
      updateSolarPreviewFromLunar(state);
      updateReading();
    };
    lunarYearInput?.addEventListener("input", handleLunarYearChange);
    lunarYearInput?.addEventListener("change", handleLunarYearChange);
    const lunarMonthInput = el.birth.querySelector('select[name="lunarMonth"]');
    lunarMonthInput?.addEventListener("change", (event) => {
      const [monthValue, leapValue] = String(event.currentTarget.value).split("|");
      state.lunarMonth = Number(monthValue);
      state.lunarLeapMonth = leapValue === "1";
      ensureValidLunarSelection(state);
      updateSolarPreviewFromLunar(state);
      updateReading();
    });
    const lunarDayInput = el.birth.querySelector('select[name="lunarDay"]');
    lunarDayInput?.addEventListener("change", (event) => {
      state.lunarDay = Number(event.currentTarget.value);
      updateSolarPreviewFromLunar(state);
      updateReading();
    });
    const timeInput = el.birth.querySelector('input[name="time"]');
    timeInput?.addEventListener("change", (event) => {
      state.time = event.currentTarget.value || state.time;
      updateReading();
    });
    const genderInput = el.birth.querySelector('select[name="gender"]');
    genderInput?.addEventListener("change", (event) => {
      state.gender = event.currentTarget.value;
      updateReading();
    });
    const provinceInput = el.birth.querySelector('select[name="birthProvince"]');
    provinceInput?.addEventListener("change", (event) => {
      state.birthProvince = event.currentTarget.value;
      const cities = buildCityOptions(state, { includeCurrentFallback: false });
      state.birthplace = cities[0]?.name ?? state.birthplace;
      updateReading();
    });
    const birthplaceInput = el.birth.querySelector('select[name="birthplace"]');
    birthplaceInput?.addEventListener("change", (event) => {
      state.birthplace = event.currentTarget.value;
      updateReading();
    });
    const trueSolarInput = el.birth.querySelector('input[name="trueSolarTime"]');
    trueSolarInput?.addEventListener("change", (event) => {
      state.trueSolarTime = event.currentTarget.checked;
      updateReading();
    });
    el.birth.querySelector("#birthForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      try {
        const nextCalendarType = form.get("calendarType") === "lunar" ? "lunar" : "solar";
        if (nextCalendarType === "lunar") {
          const [monthValue, leapValue] = String(form.get("lunarMonth")).split("|");
          state.lunarYear = Number(form.get("lunarYear"));
          state.lunarMonth = Number(monthValue);
          state.lunarDay = Number(form.get("lunarDay"));
          state.lunarLeapMonth = leapValue === "1";
          state.date = lunarToSolar({
            year: state.lunarYear,
            month: state.lunarMonth,
            day: state.lunarDay,
            isLeapMonth: state.lunarLeapMonth,
          });
        } else {
          state.date = formatSolarDateFromParts({
            year: Number(form.get("solarYear")),
            month: Number(form.get("solarMonth")),
            day: Number(form.get("solarDay")),
          });
          const lunar = solarToLunar(state.date);
          state.lunarYear = lunar.year;
          state.lunarMonth = lunar.month;
          state.lunarDay = lunar.day;
          state.lunarLeapMonth = lunar.isLeapMonth;
        }
        state.calendarType = nextCalendarType;
        state.time = form.get("time");
        state.gender = form.get("gender");
        state.birthProvince = form.get("birthProvince") || state.birthProvince;
        state.birthplace = form.get("birthplace") || "未填写";
        state.trueSolarTime = form.get("trueSolarTime") === "on";
        state.birthInputError = "";
        updateReading();
      } catch (error) {
        state.birthInputError = error.message || "日期换算失败，请检查输入。";
        renderBirthSettings({ state, el, updateReading });
      }
    });
  }

  function syncCalendarState(state) {
    if (state.date && (!state.lunarYear || !state.lunarMonth || !state.lunarDay)) {
      const lunar = solarToLunar(state.date);
      state.lunarYear = lunar.year;
      state.lunarMonth = lunar.month;
      state.lunarDay = lunar.day;
      state.lunarLeapMonth = lunar.isLeapMonth;
    }
  }

  function buildProvinceOptions(state) {
    const cities = getLocationCities(state);
    if (!cities.length) return ["常用城市"];
    return [...new Set(cities.map((city) => city.province || "其他"))];
  }

  function normalizeBirthProvince(state, provinceOptions) {
    if (state.birthProvince && provinceOptions.includes(state.birthProvince)) return state.birthProvince;
    const city = getLocationCities(state).find((item) => item.name === state.birthplace);
    if (city?.province && provinceOptions.includes(city.province)) return city.province;
    return provinceOptions[0];
  }

  function buildCityOptions(state, { includeCurrentFallback = true } = {}) {
    const allCities = getLocationCities(state);
    const cities = allCities.length
      ? allCities.filter((city) => (city.province || "其他") === state.birthProvince)
      : [];
    const options = cities.length
      ? cities.map((city) => ({
          name: city.name,
          displayName: city.displayName ?? city.name,
          province: city.province,
          city: city.city,
          area: city.area,
          longitude: city.longitude,
          latitude: city.latitude,
          standardMeridian: city.standardMeridian ?? 120,
        }))
      : [
          { name: "北京", displayName: "北京", longitude: 116.4074, latitude: 39.9042, standardMeridian: 120 },
          { name: "上海", displayName: "上海", longitude: 121.4737, latitude: 31.2304, standardMeridian: 120 },
          { name: "广州", displayName: "广州", longitude: 113.2644, latitude: 23.1291, standardMeridian: 120 },
          { name: "深圳", displayName: "深圳", longitude: 114.0579, latitude: 22.5431, standardMeridian: 120 },
          { name: "成都", displayName: "成都", longitude: 104.0665, latitude: 30.5728, standardMeridian: 120 },
          { name: "乌鲁木齐", displayName: "乌鲁木齐", longitude: 87.6168, latitude: 43.8256, standardMeridian: 120 },
        ];
    if (includeCurrentFallback && state.birthplace && !options.some((city) => city.name === state.birthplace)) {
      options.unshift({ name: state.birthplace, displayName: state.birthplace, longitude: null, latitude: null, standardMeridian: 120 });
    }
    return options;
  }

  function getLocationCities(state) {
    return state.datasets.locations?.cities?.length
      ? state.datasets.locations.cities
      : (window.BaziLocationData?.cities ?? []);
  }

  function formatProvinceName(province) {
    return province === "常用城市" ? province : province.replace(/特别行政区$/u, "").replace(/省$/u, "").replace(/市$/u, "");
  }

  function renderLocationPreview(city, trueSolarTime) {
    if (!city || city.longitude === null || city.longitude === undefined) {
      return "出生地未匹配经纬度，真太阳时不会应用。";
    }
    const longitudeCorrection = Math.round((Number(city.longitude) - Number(city.standardMeridian ?? 120)) * 4);
    return `${city.name}：经度${Number(city.longitude).toFixed(4)}，纬度${Number(city.latitude).toFixed(4)}；${trueSolarTime ? `经度校正约${longitudeCorrection}分钟，已自动参与排盘。` : "勾选真太阳时后会自动按此地校正。"}`;
  }

  function parseSolarDateParts(dateText) {
    const [year, month, day] = String(dateText).split("-").map(Number);
    return { year, month, day };
  }

  function getSolarDayCount(year, month) {
    return new Date(Date.UTC(Number(year), Number(month), 0)).getUTCDate();
  }

  function formatSolarDateFromParts({ year, month, day }) {
    const normalizedDay = Math.min(Number(day), getSolarDayCount(year, month));
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, normalizedDay));
    if (date.getUTCFullYear() !== Number(year) || date.getUTCMonth() + 1 !== Number(month)) {
      throw new RangeError("公历日期不存在，请检查年月日。");
    }
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
  }

  function updateLunarPreviewFromSolar(state, nextSolar) {
    try {
      state.date = formatSolarDateFromParts(nextSolar);
      const lunar = solarToLunar(state.date);
      state.lunarYear = lunar.year;
      state.lunarMonth = lunar.month;
      state.lunarDay = lunar.day;
      state.lunarLeapMonth = lunar.isLeapMonth;
      state.birthInputError = "";
    } catch (error) {
      state.birthInputError = error.message || "日期换算失败，请检查输入。";
    }
  }

  function ensureValidLunarSelection(state) {
    const options = getLunarMonthOptions(state.lunarYear);
    const selected = options.find((month) => month.value === state.lunarMonth && month.isLeapMonth === Boolean(state.lunarLeapMonth)) ?? options[0];
    state.lunarMonth = selected.value;
    state.lunarLeapMonth = selected.isLeapMonth;
    state.lunarDay = Math.min(Math.max(Number(state.lunarDay) || 1, 1), selected.days);
  }

  function updateSolarPreviewFromLunar(state) {
    try {
      state.date = lunarToSolar({
        year: state.lunarYear,
        month: state.lunarMonth,
        day: state.lunarDay,
        isLeapMonth: state.lunarLeapMonth,
      });
      state.birthInputError = "";
    } catch (error) {
      state.birthInputError = error.message || "日期换算失败，请检查输入。";
    }
  }

  function renderCalendarPreview(state) {
    const lunar = {
      year: state.lunarYear,
      month: state.lunarMonth,
      day: state.lunarDay,
      isLeapMonth: state.lunarLeapMonth,
    };
    return `公历 ${state.date} · ${formatLunarDate(lunar)}`;
  }

  function formatLunarDayLabel(day) {
    if (day === 10) return "初十";
    if (day === 20) return "二十";
    if (day === 30) return "三十";
    const prefixes = ["初", "十", "廿", "三"];
    const digits = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
    return `${prefixes[Math.floor(day / 10)]}${digits[day % 10]}`;
  }

  window.BaziSections = window.BaziSections ?? {};
  window.BaziSections.renderBirthSettings = renderBirthSettings;
})();
