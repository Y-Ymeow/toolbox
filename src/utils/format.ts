export const formatNumber = (value?: number, fraction = 1) =>
  value === undefined || Number.isNaN(value) ? "--" : value.toFixed(fraction);

export const formatDateTime = (value: Date) =>
  value.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
