import { NamedAPIResourceList, Pokemon } from "pokenode-ts";

export default defineEventHandler(async () => {
  const PokemonMap = await getPokemonMap();

  if (!PokemonMap) {
    return [];
  }

  const pokemons = await $fetch<NamedAPIResourceList>(
    "https://pokeapi.co/api/v2/pokemon?limit=151"
  );

  if (pokemons.results) {
    const pokemonsUrl = await Promise.all(
      pokemons.results.reduce((urlsToFetch, pokemon) => {
        const pokemonId = getPokemonIdFromUrl(pokemon.url);

        if (pokemonId && !PokemonMap.has(pokemonId)) {
          urlsToFetch.push($fetch<Pokemon>(pokemon.url));
        }

        return urlsToFetch;
      }, [] as Promise<Pokemon>[])
    );

    console.log(pokemonsUrl.length);

    pokemonsUrl.forEach((pokemon) => PokemonMap.set(pokemon.id, pokemon));

    await useStorage("pokemon").setItem(
      "list",
      Array.from(PokemonMap.entries())
    );

    return pokemons.results.map((pokemon) => {
      const pokemonId = getPokemonIdFromUrl(pokemon.url);

      if (!pokemonId) return;

      const pokemonData = PokemonMap.get(pokemonId);

      if (pokemonData) return pokemonData;
    });
  }

  return [];
});

export async function getPokemonMap(): Promise<Map<number, Pokemon>> {
  const hasMap = await useStorage("pokemon").hasItem("list");

  if (!hasMap) {
    await useStorage("pokemon").setItem(
      "list",
      Array.from(new Map().entries())
    );
  }

  const PokemonMap: Map<number, Pokemon> = new Map(
    (await useStorage("pokemon").getItem("list")) as [number, Pokemon][]
  );

  return PokemonMap;
}

function getPokemonIdFromUrl(url: string): number | undefined {
  return parseInt(/pokemon\/([0-9]*)/.exec(url)?.[1] || "");
}
