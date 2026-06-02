export function parseDateParts(dateText, timeText = "12:00") {
  const [year, month, day] = String(dateText).split("-").map(Number);
  const [hour, minute] = String(timeText).split(":").map(Number);
  return {
    year,
    month,
    day,
    hour: Number.isFinite(hour) ? hour : 12,
    minute: Number.isFinite(minute) ? minute : 0,
  };
}

export function currentYear() {
  return new Date().getFullYear();
}
