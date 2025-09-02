const getAllTypes = async () => {
    const types = await fetch('https://pokeapi.co/api/v2/type');
    const typesJSON = await types.json();
    const typesIncludingStellarAndUnknown = typesJSON.results;
    //remove stellar and unknown types
    const typesExcludingStellarAndUnknown = typesIncludingStellarAndUnknown.filter(type => type.name !== 'stellar' && type.name !== 'unknown');
    return typesExcludingStellarAndUnknown;
}

const getAllTypesFullObjects = async () => {
    const allTypesNames = await getAllTypesNames();
    const allTypes = allTypesNames.map(async (typeName) => await getTypeByName(typeName));
    return Promise.all(allTypes);
}

const getAllTypesNames = async () => {
    const types = await getAllTypes();
    let typesNames = [];
    for (let i = 0; i < types.length; i++) {
        typesNames.push(types[i].name);
    }
    return typesNames;
}

const getTypeByName = async (typeName: string) => {
    const type = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
    return type.json();
}


const getTypeStprite = async (typeName: string) => {
    const type = await getTypeByName(typeName);
    const typeIndex = type.id;
    return `https://raw.githubusercontent.com/PokeAPI/sprites/refs/heads/master/sprites/types/generation-ix/scarlet-violet/${typeIndex}.png`;

}

const getTypeImmunities = async (typeName: string): Promise<string[]> => {
    const type = await getTypeByName(typeName);
    return type.damage_relations.no_damage_from.map((type: { name: string }) => type.name);
}

const getTypeWeaknesses = async (typeName: string): Promise<string[]> => {
    const type = await getTypeByName(typeName);
    return type.damage_relations.double_damage_from.map((type: { name: string }) => type.name);
}

const getTypeResistances = async (typeName: string): Promise<string[]> => {
    const type = await getTypeByName(typeName);
    return type.damage_relations.half_damage_from.map((type: { name: string }) => type.name);
}

const getTypeSuperEffectiveAgainst = async (typeName: string): Promise<string[]> => {
    const type = await getTypeByName(typeName);
    return type.damage_relations.double_damage_to.map((type: { name: string }) => type.name);
}

const getTypeNotVeryEffectiveAgainst = async (typeName: string): Promise<string[]> => {
    const type = await getTypeByName(typeName);
    return type.damage_relations.half_damage_to.map((type: { name: string }) => type.name);
}

const getTypeDoesNotAffect = async (typeName: string): Promise<string[]> => {
    const type = await getTypeByName(typeName);
    return type.damage_relations.no_damage_to.map((type: { name: string }) => type.name);
}

const getTypeDoesNeutralDamageTo = async (typeName: string): Promise<string[]> => {
    //get all types
    const types = await getAllTypesFullObjects();
    //remove all types that is not very effective against and super effective against and does not affect
    const typesThatTypeDoesNeutralDamageTo = types.filter(type => !type.damage_relations.double_damage_to.some((type: { name: string }) => type.name === typeName) && !type.damage_relations.half_damage_to.some((type: { name: string }) => type.name === typeName) && !type.damage_relations.no_damage_to.some((type: { name: string }) => type.name === typeName));
    return typesThatTypeDoesNeutralDamageTo.map((type: { name: string }) => type.name);
}

const getTypeRecievesNeutralDamageFrom = async (typeName: string): Promise<string[]> => {
    //get all types
    const types = await getAllTypesFullObjects();
    //remove all types that is not very effective against and super effective against and does not affect
    const typesThatTypeRecievesNeutralDamageFrom = types.filter(type => !type.damage_relations.double_damage_from.some((type: { name: string }) => type.name === typeName) && !type.damage_relations.half_damage_from.some((type: { name: string }) => type.name === typeName) && !type.damage_relations.no_damage_from.some((type: { name: string }) => type.name === typeName));
    return typesThatTypeRecievesNeutralDamageFrom.map((type: { name: string }) => type.name);
}

const checkEffectiveness = async (attackingType: string, defendingTypes: string[]): Promise<string> => {
    if (defendingTypes.length === 2 && defendingTypes[0] === defendingTypes[1]) {
        defendingTypes.pop();
    }


    const superEffectiveAgainst = await getTypeSuperEffectiveAgainst(attackingType);
    const notVeryEffectiveAgainst = await getTypeNotVeryEffectiveAgainst(attackingType);
    const doesNotAffect = await getTypeDoesNotAffect(attackingType);
    const neutralDamageTo = await getTypeDoesNeutralDamageTo(attackingType);
    const neutralDamageFrom = await getTypeRecievesNeutralDamageFrom(attackingType);
    const effectivenesses = defendingTypes.map(async (defendingType) => {
        if (superEffectiveAgainst.includes(defendingType)) {
            return "super effective against";
        }
        else if (notVeryEffectiveAgainst.includes(defendingType)) {
            return "not very effective against";
        }
        else if (doesNotAffect.includes(defendingType)) {
            return "does not affect";
        }
        else if (neutralDamageTo.includes(defendingType)) {
            return "neutral damage to";
        }
        else if (neutralDamageFrom.includes(defendingType)) {
            return "neutral damage from";
        }
        else {
            return "normal damage to";
        }
    });
    const effectivenessesResolved = await Promise.all(effectivenesses);
    //if theres at least 1 element in the array that is "does not affect", return "does not affect"
    if (effectivenessesResolved.includes("does not affect")) {
        return "No le afecta.";
    }
    //if both element in the array that are "super effective against", return "super effective against (x4)"
    else if (effectivenessesResolved.every(effectiveness => effectiveness === "super effective against")) {
        return "Es súpereficaz (x4).";
    }
    //if both element in the array that are "not very effective against", return "not very effective against (x4)"
    else if (effectivenessesResolved.every(effectiveness => effectiveness === "not very effective against") && effectivenessesResolved.length > 1) {
        return "No es muy eficaz (/4).";
    }
    //if one of the elements in the array is "super effective against" and the other is "not very effective against", return "neutral damage to"
    else if (effectivenessesResolved.includes("super effective against") && effectivenessesResolved.includes("not very effective against")) {
        return "Hace daño neutro.";
    }
    //if both elements in the array are "neutral damage to", return "neutral damage to"
    else if (effectivenessesResolved.every(effectiveness => effectiveness === "neutral damage to")) {
        return "Hace daño neutro.";
    } else if (effectivenessesResolved.includes("neutral damage from")) {
        return "Hace daño neutro.";
    }
    //if one of the elements in the array is "neutral damage to", return the other element
    else if (effectivenessesResolved.includes("neutral damage to")) {
        const otherElement = effectivenessesResolved.filter(effectiveness => effectiveness !== "neutral damage to")[0];
        switch (otherElement) {
            case "super effective against":
                return "Es súpereficaz (x2).";
            case "not very effective against":
                return "No es muy eficaz (/2).";
            default:
                return "Hace daño neutro.";
        }
    }


}
const translateTypeNameToSpanish = (typeName: string) => {
    switch (typeName) {
        case "normal":
            return "normal";
        case "fighting":
            return "lucha";
        case "flying":
            return "volador";
        case "poison":
            return "veneno";
        case "ground":
            return "tierra";
        case "rock":
            return "roca";
        case "bug":
            return "bicho";
        case "ghost":
            return "fantasma";
        case "steel":
            return "acero";
        case "fire":
            return "fuego";
        case "water":
            return "agua";
        case "grass":
            return "planta";
        case "electric":
            return "eléctrico";
        case "psychic":
            return "psíquico";
        case "ice":
            return "hielo";
        case "dragon":
            return "dragón";
        case "dark":
            return "siniestro";
        case "fairy":
            return "hada";
        default:
            return typeName;
    }
}



export { translateTypeNameToSpanish, getAllTypes, getAllTypesNames, getTypeByName, getTypeStprite, getTypeImmunities, getTypeWeaknesses, getTypeResistances, getTypeSuperEffectiveAgainst, getTypeNotVeryEffectiveAgainst, getTypeDoesNotAffect, getTypeDoesNeutralDamageTo, getTypeRecievesNeutralDamageFrom, checkEffectiveness }