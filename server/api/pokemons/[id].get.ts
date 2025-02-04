import { Pokemon } from "pokenode-ts";
import { getPokemonMap } from "./index.get";

export default defineEventHandler(async (event) => {
  const idParams = getRouterParam(event, "id");
  if (!idParams) {
    return {};
  }

  const pokemonId = parseInt(idParams);
  const PokemonMap = await getPokemonMap();

  if (!PokemonMap) {
    return {};
  }

  if (PokemonMap.has(pokemonId)) {
    return PokemonMap.get(pokemonId);
  }

  return await $fetch<Pokemon>(
    `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
  );
});
