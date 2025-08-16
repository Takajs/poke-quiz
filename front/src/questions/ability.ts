import { getAllPokemonNames } from './pokemon.ts'

const fetchAbilityByIndex = async (index: number) => {
    const response = await fetch(`https://pokeapi.co/api/v2/ability/${index}`);
    const ability = await response.json();
    return ability;
}


const fetchAbilityNameByIndex = async (index: number) => {
    const ability = await fetchAbilityByIndex(index);
    return ability.name
}

const fetchAbilityByName = async (name: string) => {
    //if the ability name has a space, replace it with a dash
    const response = await fetch(`https://pokeapi.co/api/v2/ability/${name}`);
    const ability = await response.json();
    return ability;
}

const getAllPokemonNamesThatCanHaveAbility = async (abilityName: string, maxDexNumber: number) => {
    const response = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`);
    const ability = await response.json();
    const pokemon = ability.pokemon;
    const pokemonNames = [];
    for (let i = 0; i < pokemon.length; i++) {
        if (pokemon[i].pokemon.url.split('/')[6] <= maxDexNumber || pokemon[i].pokemon.url.split('/')[6] >= 10001) {
            console.log(`pushing Pokemon with ability ${abilityName}: ${pokemon[i].pokemon.name}`);
            pokemonNames.push(pokemon[i].pokemon.name);
        }
    }
    return pokemonNames;
}

const getAllPokemonThatCannotHaveAbility = async (abilityName: string, maxDexNumber: number) => {
    const pokemonNamesThatCanHaveAbility = await getAllPokemonNamesThatCanHaveAbility(abilityName, maxDexNumber);
    const allPokemonNames = await getAllPokemonNames(maxDexNumber);
    return allPokemonNames.filter(pokemonName => !pokemonNamesThatCanHaveAbility.includes(pokemonName));
}

const getMaxNumberOfPokemonThatCanHaveAbility = async (abilityName: string, maxDexNumber: number) => {
    const response = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`);
    const ability = await response.json();
    const pokemon = ability.pokemon;
    let maxNumberOfPokemonThatCanHaveAbility = 0;
    for (let i = 0; i < pokemon.length; i++) {
        if (ability.name === abilityName) {
            maxNumberOfPokemonThatCanHaveAbility++;
        }
    }
    return maxNumberOfPokemonThatCanHaveAbility;
}

const getNamesOfPokemonThatCanHaveAbility = async (abilityName: string, maxDexNumber: number) :Promise<string[]> => {
    console.log(`Fetching all Pokémon with ability: ${abilityName} and max dex number: ${maxDexNumber}`);
    const response = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`);
    const ability = await response.json();
    const pokemon = ability.pokemon;
    const pokemonNames = [];
    for (let i = 0; i < pokemon.length; i++) {
        if (ability.name === abilityName && (pokemon[i].pokemon.url.split('/')[6] <= maxDexNumber || pokemon[i].pokemon.url.split('/')[6] >= 10001)) {
            pokemonNames.push(pokemon[i].pokemon.name);
        }

    }
    if (!pokemonNames.length) {
        throw new Error(`No Pokémon found with the ability ${abilityName} in the first ${maxDexNumber} Pokémon.`);
    }
    return pokemonNames;

}



const getAbilityDescriptionByName = async (abilityName: string) => {
    const response = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`);
    const ability = await response.json();

    //first try to get it in Spanish, if not available, get it in English
    const effectEntries = ability.flavor_text_entries.find(entry => entry.language.name === 'es')

    if (effectEntries) {
        return effectEntries.flavor_text;
    }
    //return, from effect_entries, the effect of the first entry that has the language set to 'en'
    return ability.effect_entries.find(entry => entry.language.name === 'en').short_effect;
}

const getAbilityDescriptionByIndex = async (abilityIndex: number) => {
    const ability = await fetchAbilityByIndex(abilityIndex);
    //return, from effect_entries, the effect of the first entry that has the language set to 'en'
    return ability.effect_entries.find(entry => entry.language.name === 'en').effect;
}

const getRandomAbilityName = async (maxDexNumber: number) => {
    while (true) {
        const randomAbilityIndex = Math.floor(Math.random() * 233) + 1;
        const abilityName = await fetchAbilityNameByIndex(randomAbilityIndex);
        const maxNumberOfPokemonThatCanHaveAbility = await getMaxNumberOfPokemonThatCanHaveAbility(abilityName, maxDexNumber);
        if (maxNumberOfPokemonThatCanHaveAbility > 0) {
            return abilityName;
        }
    }
}

const getNRandomDifferentAbilityNames = async (numberOfAbilities: number, maxDexNumber: number) => {
    const abilityNames: string[] = [];
    while (abilityNames.length < numberOfAbilities) {
        const randomAbilityName = await getRandomAbilityName(maxDexNumber);
        if (!abilityNames.includes(randomAbilityName)) {
            abilityNames.push(randomAbilityName);
        }
    }
    return abilityNames;

}


export { getNamesOfPokemonThatCanHaveAbility, getNRandomDifferentAbilityNames, getRandomAbilityName, fetchAbilityByIndex, fetchAbilityNameByIndex, fetchAbilityByName, getAllPokemonNamesThatCanHaveAbility, getMaxNumberOfPokemonThatCanHaveAbility, getAllPokemonThatCannotHaveAbility, getAbilityDescriptionByName, getAbilityDescriptionByIndex } 