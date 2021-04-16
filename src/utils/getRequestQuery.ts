import querystring from "querystring";

const getRequestQuery = (url: string) => ({
  ...querystring.parse(url.includes("?") ? url!.split("?").pop()! : ""),
});

export default getRequestQuery;
