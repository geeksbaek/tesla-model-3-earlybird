export const Common = {
  usdTokrw: usd => (usd * 1134.72).toFixed(0),
  comma: x =>
    Number(x)
      .toFixed(0)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
};
