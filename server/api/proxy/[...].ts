export default defineCachedEventHandler(async (event) => {
  const url = getRequestURL(event);
  const query = url.searchParams;

  return await $fetch(
    `https://pokeapi.co/api/v2/${url.pathname.replace("/api/proxy/", "")}`,
    {
      query,
    }
  );
});
