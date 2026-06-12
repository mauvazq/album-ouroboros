export function isWithinDateRange(value, range) {
  if (!range.from && !range.to) return true;
  if (!value) return false;

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return false;

  if (range.from) {
    const from = new Date(`${range.from}T00:00:00`).getTime();
    if (timestamp < from) return false;
  }

  if (range.to) {
    const to = new Date(`${range.to}T23:59:59.999`).getTime();
    if (timestamp > to) return false;
  }

  return true;
}
