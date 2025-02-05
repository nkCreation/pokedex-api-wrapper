export default defineCachedEventHandler(async (event) => {
  const url = getRequestURL(event);
  const query = url.searchParams;

  appendResponseHeaders(event, {
    "Access-Control-Allow-Origin": "*",
  });

  return await $fetch(
    `https://pokeapi.co/api/v2/${url.pathname.replace("/api/proxy/", "")}`,
    {
      query,
    }
  );
});
