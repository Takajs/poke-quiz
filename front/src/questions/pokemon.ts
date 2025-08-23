
//https://pokeapi.co/api/v2/pokemon/{index}
import { getAllMovesNames } from './moves';
import { generateNDifferentRandomNumbers } from './util';
const fetchPokemon = async (pokemonIndex: number) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonIndex}`);
    const pokemon = await response.json();
    return pokemon;

}

const getPokemonSpeed = async (pokemonIndex: number): Promise<number> => {
    const pokemon = await fetchPokemon(pokemonIndex);
    return pokemon.stats.find((stat: { stat: { name: string } }) => stat.stat.name === 'speed').base_stat;
}

const fetchPokemonName = async (pokemonIndex: number): Promise<string> => {
    const pokemon = await fetchPokemon(pokemonIndex);
    return pokemon.name;
}


const getPokemonNameByIndex = async (pokemonIndex: number): Promise<string> => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonIndex}`);
    const pokemon = await response.json();
    return pokemon.name;
}

const getPokemonImageURL = async (pokemonIndex: number): Promise<string> => {

    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonIndex}.png`;
}
const getAlolanPokemonImageURL = (pokemonIndex: number): string => {
    const index = pokemonIndex.toString().padStart(3, '0');
    return `https://raw.githubusercontent.com/HybridShivam/Pokemon/refs/heads/master/assets/images/${index}-Alola.png`;
}

const getPaldeanPokemonImageURL = (pokemonIndex: number): string => {
    const index = pokemonIndex.toString().padStart(3, '0');
    return `https://raw.githubusercontent.com/HybridShivam/Pokemon/refs/heads/master/assets/images/${index}-Paldea.png`;
}

const getHisuianPokemonImageURL = (pokemonIndex: number): string => {
    const index = pokemonIndex.toString().padStart(3, '0');
    return `https://raw.githubusercontent.com/HybridShivam/Pokemon/refs/heads/master/assets/images/${index}-Hisui.png`;
}

const getGigantamaxPokemonImageURL = (pokemonIndex: number): string => {
    const index = pokemonIndex.toString().padStart(3, '0');
    return `https://raw.githubusercontent.com/HybridShivam/Pokemon/refs/heads/master/assets/images/${index}-Gmax.png`;
}

const getMegaPokemonImageURL = (pokemonIndex: number): string => {
    const index = pokemonIndex.toString().padStart(3, '0');
    return `https://raw.githubusercontent.com/HybridShivam/Pokemon/refs/heads/master/assets/images/${index}-Mega.png`;
}
const getMegaXPokemonImageURL = (pokemonIndex: number): string => {
    const index = pokemonIndex.toString().padStart(3, '0');
    return `https://raw.githubusercontent.com/HybridShivam/Pokemon/refs/heads/master/assets/images/${index}-Mega-X.png`;
}
const getMegaYPokemonImageURL = (pokemonIndex: number): string => {
    const index = pokemonIndex.toString().padStart(3, '0');
    return `https://raw.githubusercontent.com/HybridShivam/Pokemon/refs/heads/master/assets/images/${index}-Mega-Y.png`;
}
const getGalarianPokemonImageURL = (pokemonIndex: number): string => {
    const index = pokemonIndex.toString().padStart(3, '0');
    return `https://raw.githubusercontent.com/HybridShivam/Pokemon/refs/heads/master/assets/images/${index}-Galar.png`;
}

const getTerastalPokemonImageURL = (pokemonIndex: number): string => {
    const index = pokemonIndex.toString().padStart(3, '0');
    return `https://raw.githubusercontent.com/HybridShivam/Pokemon/refs/heads/master/assets/images/${index}-Terastal.png`;
}

const getTypeImageURL = async (typeName: string): Promise<string> => {
    //get the index of the type reading it from pokeapi
    const type = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
    const typeData = await type.json();
    const typeIndex = typeData.id;
    console.log(`Type ${typeName} has index ${typeIndex}`);
    return `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/types/generation-ix/scarlet-violet/${typeIndex}.png`;
}

const getPokemonCryURL = (pokemonIndex: number): string => {
    return `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonIndex}.ogg`;
}

const getPokemonMovesNames = async (pokemonIndex: number): Promise<string[]> => {
    const pokemon = await fetchPokemon(pokemonIndex);
    const moves = pokemon.moves;
    let movesNames = [];
    for (let i = 0; i < moves.length; i++) {
        movesNames.push(moves[i].move.name);
    }
    movesNames = movesNames.filter(moveName => !moveName.includes("Max-"));
    movesNames = movesNames.filter(moveName => !moveName.includes("Max "));

    movesNames = movesNames.filter(moveName => !moveName.includes("Black hole"));
    movesNames = movesNames.filter(moveName => !moveName.includes("10"));
    movesNames = movesNames.filter(moveName => !moveName.includes("eevee"));
    movesNames = movesNames.filter(moveName => !moveName.includes("pika"));
    movesNames = movesNames.filter(moveName => !moveName.includes("gigavolt"));
    movesNames = movesNames.filter(moveName => !moveName.includes("pancake"));
    movesNames = movesNames.filter(moveName => !moveName.includes("special"));
    movesNames = movesNames.filter(moveName => !moveName.includes("physical"));


    movesNames = movesNames.map(moveName => moveName.replace('-', ' '));
    return movesNames;
}


const getRandomPokemonNamesAndIndexes = async (numberOfNamesToGet: number, maxPokedexIndex: number) => {
    if (maxPokedexIndex < 1) {
        return [];
    }
    const pokemonNames: { name: string, index: number }[] = [];
    //Make sure the same pokemon is not added twice
    const randomIndexes = generateNDifferentRandomNumbers(numberOfNamesToGet, 1, maxPokedexIndex);
    for (let i = 0; i < randomIndexes.length; i++) {

        pokemonNames.push({
            name: await fetchPokemonName(randomIndexes[i]),
            index: randomIndexes[i]
        });
    }
    return pokemonNames;

}

const fetchPokemonSpecies = async (pokemonIndex: number) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}`);
    const pokemonSpecies = await response.json();
    return pokemonSpecies;
}

const hasThisPokemonGenderDifference = async (pokemonIndex: number): Promise<boolean> => {
    const pokemon = await fetchPokemonSpecies(pokemonIndex);
    return pokemon.has_gender_differences;
}

const hasThisPokemonGender = async (pokemonIndex: number): Promise<boolean> => {
    const pokemon = await fetchPokemonSpecies(pokemonIndex);
    return (pokemon.gender_rate !== -1)
}

const getAllPokemonNamesThatCanLearnMove = async (moveName: string, maxPokedexIndex: number) => {
    const response = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
    const move = await response.json();
    const pokemonThatCanLearnMove: { name: string, index: number }[] = [];
    for (const learnMethod of move.learned_by_pokemon) {
        if (learnMethod.url) {
            const pokemonIndex = parseInt(learnMethod.url.split('/').slice(-2, -1)[0]);
            if (pokemonIndex <= maxPokedexIndex) {
                pokemonThatCanLearnMove.push({
                    name: learnMethod.name,
                    index: pokemonIndex
                });
            }
        }
    }
    return pokemonThatCanLearnMove;
}


const getNRandomMovesNamesThatPokemonKnows = async (pokemonIndex: number, numberOfMoves: number) => {
    if (numberOfMoves < 1) {
        return [];
    }
    let movesNames = await getPokemonMovesNames(pokemonIndex);
    //remove max etc
    movesNames = movesNames.filter(moveName => !moveName.includes("Max-"));
    movesNames = movesNames.filter(moveName => !moveName.includes("Max "));
    movesNames = movesNames.filter(moveName => !moveName.includes("Zippy Zap"));


    movesNames = movesNames.filter(moveName => !moveName.includes("Black hole"));
    movesNames = movesNames.filter(moveName => !moveName.includes("10"));
    movesNames = movesNames.filter(moveName => !moveName.includes("eevee"));
    movesNames = movesNames.filter(moveName => !moveName.includes("pika"));
    movesNames = movesNames.filter(moveName => !moveName.includes("gigavolt"));
    movesNames = movesNames.filter(moveName => !moveName.includes("pancake"));
    movesNames = movesNames.filter(moveName => !moveName.includes("special"));
    movesNames = movesNames.filter(moveName => !moveName.includes("physical"));


    return generateNDifferentRandomNumbers(numberOfMoves, 0, movesNames.length).map(i => movesNames[i]);
}

const getNRandomMovesNamesThatPokemonDoesNotKnow = async (pokemonIndex: number, numberOfMoves: number) => {
    if (numberOfMoves < 1) {
        return [];
    }
    const allMovesNames = await getAllMovesNames();
    const knownMovesNames = await getPokemonMovesNames(pokemonIndex);
    const movesNames = allMovesNames.filter(moveName => !knownMovesNames.includes(moveName));
    return generateNDifferentRandomNumbers(numberOfMoves, 0, movesNames.length).map(i => movesNames[i]);
}

const getPokemonIndexByName = async (pokemonName: string): Promise<number> => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    const pokemon = await response.json();
    return pokemon.id;
}

const getAllPokemonNames = async (maxDexNumber: number) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${maxDexNumber}`);
    const pokemon = await response.json();
    let results = pokemon.results.map((pokemon: { name: string }) => pokemon.name);
    results = results.filter((name: string) => !name.includes('Starter'));
    return results;

}

const getPokemonType = async (pokemonIndex: number) => {
    const pokemon = await fetchPokemon(pokemonIndex);
    return pokemon.types.map((type: { type: { name: string } }) => type.type.name);
}

const getPokemonBaseAttack = async (pokemonIndex: number): Promise<number> => {
    const pokemon = await fetchPokemon(pokemonIndex);
    return pokemon.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 0;
}


const getPokemonBaseDefense = async (pokemonIndex: number): Promise<number> => {
    const pokemon = await fetchPokemon(pokemonIndex);
    return pokemon.stats.find(stat => stat.stat.name === 'defense')?.base_stat || 0;
}

const getPokemonBaseHP = async (pokemonIndex: number): Promise<number> => {
    const pokemon = await fetchPokemon(pokemonIndex);
    return pokemon.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 0;
}
const getPokemonBaseSpecialAttack = async (pokemonIndex: number): Promise<number> => {
    const pokemon = await fetchPokemon(pokemonIndex);
    return pokemon.stats.find(stat => stat.stat.name === 'special-attack')?.base_stat || 0;
}
const getPokemonBaseSpecialDefense = async (pokemonIndex: number): Promise<number> => {
    const pokemon = await fetchPokemon(pokemonIndex);
    return pokemon.stats.find(stat => stat.stat.name === 'special-defense')?.base_stat || 0;
}

const getPokemonSpecies = async (pokemonIndex: number) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch species for Pokémon index ${pokemonIndex}`);
    }
    const species = await response.json();
    return species;
}

export {
    getPokemonSpecies,
    hasThisPokemonGender,
    hasThisPokemonGenderDifference,
    getAllPokemonNamesThatCanLearnMove,
    getPokemonSpeed,
    getPokemonBaseAttack,
    getPokemonBaseDefense,
    getPokemonBaseHP,
    getPokemonBaseSpecialAttack,
    getPokemonBaseSpecialDefense,

    getTypeImageURL, getMegaXPokemonImageURL, getMegaYPokemonImageURL, getGalarianPokemonImageURL, getAlolanPokemonImageURL, getPaldeanPokemonImageURL, getHisuianPokemonImageURL, getGigantamaxPokemonImageURL, getMegaPokemonImageURL, getTerastalPokemonImageURL,
    getPokemonType, getRandomPokemonNamesAndIndexes, fetchPokemon, fetchPokemonName, getPokemonImageURL, getPokemonCryURL, getPokemonMovesNames, getNRandomMovesNamesThatPokemonKnows, getNRandomMovesNamesThatPokemonDoesNotKnow, getPokemonIndexByName, getAllPokemonNames
};
