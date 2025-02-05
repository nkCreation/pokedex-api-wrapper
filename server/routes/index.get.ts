export default defineCachedEventHandler(async () => {
  return "Hello to this Pokedex API wrapper ! It will serves through the /api/pokemons endpoint a cached list of pokemons with details for each, not just URL.\r\nIt will also serve through the /api/pokemons/[id] endpoint a cached pokemon endpoint.\r\nYou can pass multiples id in a coma-separated list to fetch multiples pokemons for example /api/pokemons/1,2,3,4.\r\nIt will also serve through the /api/proxy/[...] endpoint a proxy to the PokeAPI.";
});
