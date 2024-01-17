/**
 * Takes an object and converts the key-pair values into a query string preceded by "?" and the
 * values separated by "&"
 * @param {object} obj
 * @returns
 */
export default function queryBuilder(obj) {
  const queryValues = Object.keys(obj)
    .filter(([key, value]) => value !== null && value !== undefined)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join("&");

  if (queryValues.length) {
    return "?" + queryValues;
  }

  return "";
}
