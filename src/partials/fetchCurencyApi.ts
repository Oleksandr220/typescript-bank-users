async function fetchCurencyApi(currency:any) {
  const options = { method: "GET", headers: { Accept: "application/json" } };

  const currencyDollar = await fetch(
    `https://api.fastforex.io/fetch-multi?from=USD&to=${currency}&api_key=adfa616511-bc6586b63c-r1fjlv`,
    options
  );
  const resultJson = await currencyDollar.json();
  const result = await resultJson.results;
  const resultCurrency = await result[currency];

  return resultCurrency;
}

export default fetchCurencyApi;