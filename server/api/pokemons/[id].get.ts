import { Pokemon } from "pokenode-ts";
import { getPokemonMap } from "./index.get";

export default defineCachedEventHandler(async (event) => {
  const idParams = getRouterParam(event, "id");
  if (!idParams) {
    return {};
  }

  const pokemonIds = idParams.includes(",")
    ? idParams.split(",").map((id) => parseInt(id))
    : [parseInt(idParams)];
  const PokemonMap = await getPokemonMap();

  if (!PokemonMap) {
    return {};
  }

  const pokemons = await Promise.all(
    pokemonIds.map(async (pokemonId) => {
      if (PokemonMap.has(pokemonId)) {
        return PokemonMap.get(pokemonId);
      }

      const pokemon = await $fetch<Pokemon>(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
      );

      PokemonMap.set(pokemon.id, { ...pokemon, moves: [] });

      await useStorage("pokemon").setItem(
        "list",
        Array.from(PokemonMap.entries())
      );

      return PokemonMap.get(pokemon.id);
    })
  );

  appendResponseHeaders(event, {
    "Access-Control-Allow-Origin": "*",
  });

  return pokemons.length === 1 ? pokemons[0] : pokemons;
});
