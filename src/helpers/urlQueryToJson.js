export default function urlQueryToJson(queryString) {
  if (!queryString) return;
  const result = {};
  queryString.split("&").forEach(function (part) {
    const item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}
