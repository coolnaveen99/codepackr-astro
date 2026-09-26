export function resolveHistoricalUtcOffset(
  ianaTimezone,
  year,
  month,
  day,
  hour = 12,
  minute = 0
) {
  const getOffsetAtDate = (dateObj) => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: ianaTimezone,
      timeZoneName: "longOffset",
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });

    const parts = formatter.formatToParts(dateObj);
    const tzPart = parts.find((p) => p.type === "timeZoneName")?.value || "GMT";
    const match = tzPart.match(/GMT([+-])(\d{1,2}):?(\d{2})?/);
    if (!match) {
      return { offsetHours: 0, offsetString: "+00:00" };
    }
    const sign = match[1] === "-" ? -1 : 1;
    const h = parseInt(match[2], 10);
    const m = match[3] ? parseInt(match[3], 10) : 0;
    const offsetHours = sign * (h + m / 60);
    const offsetString = `${match[1]}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    return { offsetHours, offsetString };
  };

  // Step 1: Initial guess (assuming 0 offset)
  const initialTime = Date.UTC(year, month - 1, day, hour, minute);
  const firstPass = getOffsetAtDate(new Date(initialTime));

  // Step 2: Refine instant by adjusting for the first-pass offset
  const refinedTime = initialTime - firstPass.offsetHours * 3600000;
  const secondPass = getOffsetAtDate(new Date(refinedTime));

  return secondPass;
}

// 2023 US DST spring forward: March 12, 2023 (at 2:00 AM clock jumps to 3:00 AM)
console.log("NY 2023-03-12 01:00 (EST):", resolveHistoricalUtcOffset("America/New_York", 2023, 3, 12, 1, 0));
console.log("NY 2023-03-12 04:00 (EDT):", resolveHistoricalUtcOffset("America/New_York", 2023, 3, 12, 4, 0));
