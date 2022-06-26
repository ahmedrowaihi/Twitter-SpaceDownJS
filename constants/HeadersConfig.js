const { TWITTER_API_KEY } = process.env;
export const HeadersConfig = {
  headers: {
    Accept: "*/*",
    Authorization: TWITTER_API_KEY,
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0",
    "Accept-Language": "de,en-US;q=0.7,en;q=0.3",
    "Accept-Encoding": "gzip, deflate, br",
    TE: "trailers",
  },
};
