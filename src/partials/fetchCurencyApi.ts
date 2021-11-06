async function fetchCurencyApi(currency:any) {
  const options = { method: "GET", headers: { Accept: "application/json" } };

  const currencyDollar = await fetch(
    `https://api.fastforex.io/fetch-multi?from=USD&to=${currency}&api_key=029a7c7718-6b19158361-r25gny`,
    options
  );
  const resultJson = await currencyDollar.json();
  const result = await resultJson.results;
  const resultCurrency = await result[currency];

  return resultCurrency;
}

export default fetchCurencyApi;