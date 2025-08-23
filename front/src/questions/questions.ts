//Who's that Pokemon?
import { QUESTION } from '../components/types';
import {
    getPokemonSpecies,
    getPokemonBaseAttack,
    getPokemonBaseDefense,
    getPokemonBaseHP,
    getPokemonBaseSpecialAttack,
    getPokemonBaseSpecialDefense, hasThisPokemonGender, hasThisPokemonGenderDifference, getAllPokemonNamesThatCanLearnMove, getPokemonSpeed, getTypeImageURL, getMegaXPokemonImageURL, getMegaYPokemonImageURL, getPokemonType, getPokemonIndexByName, getRandomPokemonNamesAndIndexes, fetchPokemon, fetchPokemonName, getPokemonImageURL, getPokemonCryURL, getPokemonMovesNames, getNRandomMovesNamesThatPokemonKnows, getNRandomMovesNamesThatPokemonDoesNotKnow, getAlolanPokemonImageURL
    , getGalarianPokemonImageURL, getPaldeanPokemonImageURL, getHisuianPokemonImageURL, getGigantamaxPokemonImageURL, getMegaPokemonImageURL, getTerastalPokemonImageURL
} from './pokemon';
import { getNRandomDifferentAbilityNames, getRandomAbilityName, getAbilityDescriptionByIndex, getAbilityDescriptionByName, fetchAbilityByIndex, fetchAbilityNameByIndex, fetchAbilityByName, getAllPokemonNamesThatCanHaveAbility, getMaxNumberOfPokemonThatCanHaveAbility, getAllPokemonThatCannotHaveAbility, getNamesOfPokemonThatCanHaveAbility } from './ability';
import { getMoveByName, getNRandomDifferentMovesNamesAndIndexes, getAllMovesNames, getTargetOfMove, getMoveType, getMoveDescriptionByName } from './moves';
import { generateNDifferentRandomNumbers } from './util';
import { trivia } from './trivia';
import { translateTypeNameToSpanish, getAllTypes, getAllTypesNames, getTypeByName, getTypeStprite, getTypeImmunities, getTypeWeaknesses, getTypeResistances, getTypeSuperEffectiveAgainst, getTypeNotVeryEffectiveAgainst, getTypeDoesNotAffect, getTypeDoesNeutralDamageTo, getTypeRecievesNeutralDamageFrom, checkEffectiveness } from './type';

const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const capitalizeFirstLetter = (str: string) => {

    //ignore if string starts with a number
    if (!isNaN(parseInt(str.charAt(0)))) {
        return str;
    }

    let answer = str.charAt(0).toUpperCase() + str.slice(1);
    //also capitalize the first letter after a "-"
    answer = answer.replace(/-\w/g, (match) => match.toUpperCase());


    //Replace "-" with " "
    return answer.replace(/-/g, ' ');
}

const smallLetterFirstLetter = (string: string) => {
    return string.charAt(0).toLowerCase() + string.slice(1);
}
const generateOnCorrectPrefix = () => {
    const possiblePrefixes = ['¡Correcto ', '¡Muy bien ', '¡Excelente ', '¡Sí ', '¡Na na na, no te la creo ', '¡Eso es '];
    const positiveEmojis = ['👍', '👏', '🎉', '🥳', '🤩', '😎', '🤠', '✨', '🔥']
    const randomPrefix = possiblePrefixes[Math.floor(Math.random() * possiblePrefixes.length)];
    const randomEmoji = positiveEmojis[Math.floor(Math.random() * positiveEmojis.length)];
    return `${randomPrefix} ${randomEmoji}! `;
}
const generatePokemonTrivia = async (pokedexIndex: number): Promise<string> => {
    //trivia is an array that contains an array of trivia strings for each pokemon at their respective index
    const surpriseEmojis = ['😲', '😯', '😱', '😵', '🤯', '😮', '😳']
    if (!trivia[pokedexIndex]?.length || trivia[pokedexIndex]?.length === 0) {
        return "";
    }
    const triviaStrings = trivia[pokedexIndex];
    const randomTriviaIndex = Math.floor(Math.random() * triviaStrings.length - 1) + 1;
    let triviaString = triviaStrings[randomTriviaIndex];


    //uncapitalize the first letter
    triviaString = triviaString.charAt(0).toLowerCase() + triviaString.slice(1);
    return `Sabías que ... ${triviaString} ${surpriseEmojis[Math.floor(Math.random() * surpriseEmojis.length)]}`;
}

const generateOnIncorrectMessage = (correctAnswer: string) => {
    const possiblePrefixes = ['¡Incorrecto!', '¡No!', '¡Mal!'];
    const negativeEmojis = ['😢', '😭', '😤', '👎', '❌', '😑', '😠'];
    const randomPrefix = possiblePrefixes[Math.floor(Math.random() * possiblePrefixes.length)];
    const randomEmoji = negativeEmojis[Math.floor(Math.random() * negativeEmojis.length)];
    return `${randomPrefix} La respuesta correcta era ${capitalizeFirstLetter(correctAnswer)} ${randomEmoji}. `;
}

//Different types of questions:

const generateWhosThatPokemonQuestion = async (maxPokedexIndex: number): Promise<QUESTION> => {

    const pokemonNamesAndIndexes = await getRandomPokemonNamesAndIndexes(4, maxPokedexIndex);
    const correctAnswerIndex = Math.floor(Math.random() * 4);
    const answers = [];
    for (let i = 0; i < 4; i++) {
        answers.push({
            isCorrect: i === correctAnswerIndex,
            answerText: capitalizeFirstLetter(pokemonNamesAndIndexes[i].name),
            answerImages: [],
            answerAudios: []
        });
    }

    const picture = await getPokemonImageURL(pokemonNamesAndIndexes[correctAnswerIndex].index);

    const trivia = await generatePokemonTrivia(pokemonNamesAndIndexes[correctAnswerIndex].index);
    console.log(`Trivia for ${pokemonNamesAndIndexes[correctAnswerIndex].index} ${pokemonNamesAndIndexes[correctAnswerIndex].name}: ${trivia}`);

    return {
        questionText: '¿Cuál es este Pokémon?',
        questionImages: [picture],
        questionAudios: [],
        allowsMultipleAnswers: false,
        score: 1,
        onCorrectText: generateOnCorrectPrefix() + await generatePokemonTrivia(pokemonNamesAndIndexes[correctAnswerIndex].index),
        onCorrectImages: [picture],
        onCorrectAudios: [],
        onIncorrectText: generateOnIncorrectMessage(pokemonNamesAndIndexes[correctAnswerIndex].name),
        onIncorrectImages: [picture],
        onIncorrectAudios: [],
        answers: answers
    }
};

const generateWhoThisCryBelongsToQuestion = async (maxPokedexIndex: number): Promise<QUESTION> => {
    const pokemonNamesAndIndexes = await getRandomPokemonNamesAndIndexes(4, maxPokedexIndex);
    const correctAnswerIndex = Math.floor(Math.random() * 4);
    const answers = [];
    for (let i = 0; i < 4; i++) {
        answers.push({
            isCorrect: i === correctAnswerIndex,
            answerText: capitalizeFirstLetter(pokemonNamesAndIndexes[i].name),
            answerImages: [await getPokemonImageURL(pokemonNamesAndIndexes[i].index)],
            answerAudios: []
        });
    }

    const audio = getPokemonCryURL(pokemonNamesAndIndexes[correctAnswerIndex].index);
    const picture = await getPokemonImageURL(pokemonNamesAndIndexes[correctAnswerIndex].index);

    return {
        questionText: '¿A qué Pokémon pertenece este grito?',
        questionImages: [],
        questionAudios: [audio],
        allowsMultipleAnswers: false,
        score: 1,
        onCorrectText: generateOnCorrectPrefix() + await generatePokemonTrivia(pokemonNamesAndIndexes[correctAnswerIndex].index),
        onCorrectImages: [picture],
        onCorrectAudios: [audio],
        onIncorrectText: generateOnIncorrectMessage(pokemonNamesAndIndexes[correctAnswerIndex].name),
        onIncorrectImages: [picture],
        onIncorrectAudios: [audio],
        answers: answers
    }
}

const generateWhichOfTheseMovesDoesPokemonKnowQuestion = async (maxPokedexIndex: number): Promise<QUESTION> => {
    const pokemonNamesAndIndexes = await getRandomPokemonNamesAndIndexes(1, maxPokedexIndex);
    const pokemonIndex = pokemonNamesAndIndexes[0].index;
    const numberOfCorrectAnswers = Math.floor(Math.random() * 4) + 1;
    const movesNamesThatPokemonKnows = await getNRandomMovesNamesThatPokemonKnows(pokemonIndex, numberOfCorrectAnswers);
    //replace "-" with " " in the moves names

    let movesNamesThatPokemonDoesNotKnow = await getNRandomMovesNamesThatPokemonDoesNotKnow(pokemonIndex, 4 - numberOfCorrectAnswers);
    //replace "-" with " " in the moves names
    movesNamesThatPokemonDoesNotKnow = movesNamesThatPokemonDoesNotKnow.map(moveName => moveName.replace(/-/g, ' '));

    const correctAnswers = [];
    for (let i = 0; i < numberOfCorrectAnswers; i++) {
        correctAnswers.push({
            isCorrect: true,
            answerText: capitalizeFirstLetter(movesNamesThatPokemonKnows[i]),
            answerImages: [],
            answerAudios: []
        });
    }
    const incorrectAnswers = [];
    for (let i = 0; i < 4 - numberOfCorrectAnswers; i++) {
        incorrectAnswers.push({
            isCorrect: false,
            answerText: capitalizeFirstLetter(movesNamesThatPokemonDoesNotKnow[i]),
            answerImages: [],
            answerAudios: []
        });
    }
    const answers = correctAnswers.concat(incorrectAnswers);
    shuffleArray(answers);
    const picture = await getPokemonImageURL(pokemonIndex);

    return {
        questionText: `¿Cuál(es) de estos movimientos puede aprender ${capitalizeFirstLetter(pokemonNamesAndIndexes[0].name)}?`,
        questionImages: [picture],
        questionAudios: [],
        allowsMultipleAnswers: true,
        score: 1,
        onCorrectText: generateOnCorrectPrefix() + await generatePokemonTrivia(pokemonIndex),
        onCorrectImages: [picture],
        onCorrectAudios: [],
        onIncorrectText: generateOnIncorrectMessage(correctAnswers.map(answer => answer.answerText).join(' , ')),
        onIncorrectImages: [picture],
        onIncorrectAudios: [],
        answers: answers
    }
}

const generateWhichOfThesePokemonCanHaveAbilityQuestion = async (maxPokedexIndex: number): Promise<QUESTION> => {
    let abilityIndex;
    let pokemonNamesThatCanHaveAbility = [];
    let ability = "";
    while (pokemonNamesThatCanHaveAbility.length === 0) {
        abilityIndex = Math.floor(Math.random() * 307) + 1; //This number is ok for gen 9
        ability = await fetchAbilityNameByIndex(abilityIndex);
        pokemonNamesThatCanHaveAbility = await getAllPokemonNamesThatCanHaveAbility(ability, maxPokedexIndex);
    }
    const maxNumberOfPokemon = await getMaxNumberOfPokemonThatCanHaveAbility(ability, maxPokedexIndex);
    const maxNumberOfCorrectAnswers = Math.min(4, maxNumberOfPokemon);
    const numberOfCorrectAnswers = Math.floor(Math.random() * maxNumberOfCorrectAnswers) + 1;
    const correctAnswers = [];

    //get numberOfCorrectAnswers random pokemon names that can have the ability
    shuffleArray(pokemonNamesThatCanHaveAbility);
    for (let i = 0; i < numberOfCorrectAnswers; i++) {
        correctAnswers.push({
            isCorrect: true,
            answerText: capitalizeFirstLetter(pokemonNamesThatCanHaveAbility[i]),
            answerImages: [await getPokemonImageURL(await getPokemonIndexByName(pokemonNamesThatCanHaveAbility[i]))],
            answerAudios: []
        });
    }

    const incorrectAnswers = [];
    //get 4 - numberOfCorrectAnswers random pokemon names that cannot have the ability
    const pokemonNamesThatCannotHaveAbility = await getAllPokemonThatCannotHaveAbility(ability, maxPokedexIndex);
    shuffleArray(pokemonNamesThatCannotHaveAbility);
    for (let i = 0; i < 4 - numberOfCorrectAnswers; i++) {
        incorrectAnswers.push({
            isCorrect: false,
            answerText: capitalizeFirstLetter(pokemonNamesThatCannotHaveAbility[i]),
            answerImages: [await getPokemonImageURL(await getPokemonIndexByName(pokemonNamesThatCannotHaveAbility[i]))],
            answerAudios: []
        });
    }
    const answers = correctAnswers.concat(incorrectAnswers);
    shuffleArray(answers);

    const remainingTotalPokemonThatCanHaveAbility = maxNumberOfPokemon - numberOfCorrectAnswers;
    const onCorrectText = remainingTotalPokemonThatCanHaveAbility > 0
        ?
        remainingTotalPokemonThatCanHaveAbility === 1
            ?
            generateOnCorrectPrefix() + `Además de ${correctAnswers.map(answer => answer.answerText).join(' , ')}, solo hay otro Pokémon más que pueda tener la habilidad ${capitalizeFirstLetter(ability)}.`
            :
            generateOnCorrectPrefix() + `A parte de ${correctAnswers.map(answer => answer.answerText).join(' , ')}, hay otros ${maxNumberOfPokemon - numberOfCorrectAnswers} Pokémon que pueden tener la habilidad ${capitalizeFirstLetter(ability)}.`
        :
        maxNumberOfPokemon === 1

            ?
            generateOnCorrectPrefix() + `${correctAnswers.map(answer => answer.answerText).join(' , ')} es el único Pokémon que puede tener la habilidad ${capitalizeFirstLetter(ability)}.`
            :
            generateOnCorrectPrefix() + `${correctAnswers.map(answer => answer.answerText).join(' , ')} son los únicos Pokémon que pueden tener la habilidad ${capitalizeFirstLetter(ability)}.`;

    const allPokemonThatCanHaveTheAbility = await getAllPokemonNamesThatCanHaveAbility(ability, maxPokedexIndex)

    //The images of all the Pokémon that can have the ability
    const onCorrectImages = [];
    for (let i = 0; i < allPokemonThatCanHaveTheAbility.length; i++) {
        const imageURL = await getPokemonImageURL(await getPokemonIndexByName(allPokemonThatCanHaveTheAbility[i]));
        onCorrectImages.push(imageURL);
    }

    return {
        questionText: `¿Cuál(es) de estos Pokémon puede(n) tener la habilidad ${capitalizeFirstLetter(ability)}?`,
        questionImages: [],
        questionAudios: [],
        allowsMultipleAnswers: true,
        score: 1,
        onCorrectText: onCorrectText,
        onCorrectImages: [...onCorrectImages],
        onCorrectAudios: [],
        onIncorrectText: generateOnIncorrectMessage(correctAnswers.map(answer => answer.answerText).join(' , ')),
        onIncorrectImages: [...onCorrectImages],
        onIncorrectAudios: [],
        answers: answers
    }


}

const whatDoesThisAbilityDoQuestion = async (maxPokedexIndex: number): Promise<QUESTION> => {
    const abilitiesNames = await getNRandomDifferentAbilityNames(4, maxPokedexIndex);
    const correctAnswerIndex = Math.floor(Math.random() * 4);
    const correctAnswer = abilitiesNames[correctAnswerIndex];
    const correctAnswerDescription = await getAbilityDescriptionByName(correctAnswer);
    const incorrectAnswers = abilitiesNames.filter(abilityName => abilityName !== correctAnswer);
    const incorrectAnswersDescriptions = await Promise.all(incorrectAnswers.map(abilityName => getAbilityDescriptionByName(abilityName)));
    const answers = [];

    //push the correct answer
    answers.push({
        isCorrect: true,
        answerText: capitalizeFirstLetter(correctAnswerDescription),
        answerImages: [],
        answerAudios: []
    });

    //push the incorrect answers
    for (let i = 0; i < 3; i++) {
        answers.push({
            isCorrect: false,
            answerText: capitalizeFirstLetter(incorrectAnswersDescriptions[i]),
            answerImages: [],
            answerAudios: []
        });
    }

    shuffleArray(answers);


    /////

    const onCorrectImages = [];
    console.log(`GENERATING.....`);
    const preProcessedPokemonNames: string[] = await getNamesOfPokemonThatCanHaveAbility(correctAnswer, 1025);
    //Remove any "totem" pokemon from the list
    const pokemonName = preProcessedPokemonNames.filter(name => !name.includes("-female") && !name.includes("pikachu-") && !name.includes("totem") && !name.includes("-breed") && !name.includes("-starter") && !name.includes("-dada"));
    console.log(`GENERATED: Pokemon with ability ${correctAnswer}: ${pokemonName}`);

    for (let i = 0; i < pokemonName.length; i++) {


        //if correctAnswer contains "alola"
        /*
                if (pokemonName[i].toLowerCase().includes("alola")) {
                    const nameWithoutAlola = pokemonName[i].replace("-alola", "").trim();
                    console.log(`Alolan Pokemon: ${nameWithoutAlola}`);
                    onCorrectImages.push(getAlolanPokemonImageURL(await getPokemonIndexByName(nameWithoutAlola)));
                }
                else if (pokemonName[i].toLowerCase().includes("galar")) {
                    const nameWithoutGalar = pokemonName[i].replace("-galar", "").trim();
                    console.log(`Galarian Pokemon: ${nameWithoutGalar}`);
                    onCorrectImages.push(getGalarianPokemonImageURL(await getPokemonIndexByName(nameWithoutGalar)));
                }
                else if (pokemonName[i].toLowerCase().includes("paldea")) {
        
                }
        
        
                else if (pokemonName[i].toLowerCase().includes("hisui")) {
                    const nameWithoutHisui = pokemonName[i].replace("-hisui", "").trim();
                    console.log(`Hisuian Pokemon: ${nameWithoutHisui}`);
                    onCorrectImages.push(getHisuianPokemonImageURL(await getPokemonIndexByName(nameWithoutHisui)));
                }
                else if (pokemonName[i].toLowerCase().includes("gmax")) {
                    const nameWithoutGmax = pokemonName[i].replace("-gmax", "").trim();
                    console.log(`Gigantamax Pokemon: ${nameWithoutGmax}`);
                    onCorrectImages.push(getGigantamaxPokemonImageURL(await getPokemonIndexByName(nameWithoutGmax)));
                }
                else if (pokemonName[i].toLowerCase().includes("mega")) {
                    if (!pokemonName[i].toLowerCase().includes("-x") && !pokemonName[i].toLowerCase().includes("-y")) {
                        const nameWithoutMega = pokemonName[i].replace("-mega", "").trim();
                        console.log(`Mega Pokemon: ${nameWithoutMega}`);
                        onCorrectImages.push(getMegaPokemonImageURL(await getPokemonIndexByName(nameWithoutMega)));
                    }
                    if (pokemonName[i].toLowerCase().includes("-x")) {
                        const nameWithoutMegaX = pokemonName[i].replace("-mega-x", "").trim();
                        console.log(`Mega X Pokemon: ${nameWithoutMegaX}`);
                        onCorrectImages.push(getMegaXPokemonImageURL(await getPokemonIndexByName(nameWithoutMegaX)));
                    }
                    if (pokemonName[i].toLowerCase().includes("-y")) {
                        const nameWithoutMegaY = pokemonName[i].replace("-mega-y", "").trim();
                        console.log(`Mega Y Pokemon: ${nameWithoutMegaY}`);
                        onCorrectImages.push(getMegaYPokemonImageURL(await getPokemonIndexByName(nameWithoutMegaY)));
                    }
                }
                else if (pokemonName[i].toLowerCase().includes("terastal")) {
                    const nameWithoutTerastal = pokemonName[i].replace("-terastal", "").trim();
                    console.log(`Terastal Pokemon: ${nameWithoutTerastal}`);
                    onCorrectImages.push(getTerastalPokemonImageURL(await getPokemonIndexByName(nameWithoutTerastal)));
                }
                else if (pokemonName[i].toLowerCase().includes("segment")) {
                    //Remove any other ocurrences of "segment" elements in the array
        
                    onCorrectImages.push("https://archives.bulbagarden.net/media/upload/6/65/0982Dudunsparce.png");
                }
                else if (pokemonName[i].toLowerCase().includes("maushold")) {
        
                    onCorrectImages.push("https://archives.bulbagarden.net/media/upload/f/f4/0925Maushold.png");
                }*/

        const imageURL = await getPokemonImageURL(await getPokemonIndexByName(pokemonName[i]))
        console.log(`DECIDED: ${imageURL}`);
        onCorrectImages.push(imageURL);
        console.log(`Pokemon with ability ${correctAnswer}: ${pokemonName[i]} pushed image URL ${onCorrectImages[i]}`);
    }

    const onCorrectText = pokemonName.length === 1
        ?
        generateOnCorrectPrefix() + `Solamente un Pokémon puede tener la habilidad ${capitalizeFirstLetter(correctAnswer)}.`
        :
        generateOnCorrectPrefix() + `Un total de ${pokemonName.length} Pokémon pueden tener la habilidad ${capitalizeFirstLetter(correctAnswer)}.`;




    return {
        questionText: `¿Qué hace la habilidad ${capitalizeFirstLetter(correctAnswer)}?`,
        questionImages: [],
        questionAudios: [],
        allowsMultipleAnswers: false,
        score: 1,
        onCorrectText: onCorrectText,
        onCorrectImages: [...onCorrectImages],
        onCorrectAudios: [],
        onIncorrectText: generateOnIncorrectMessage(capitalizeFirstLetter(correctAnswerDescription)),
        onIncorrectImages: [...onCorrectImages],
        onIncorrectAudios: [],
        answers: answers
    }
}

const whatsThePowerOfThisMoveQuestion = async (maxPokedexIndex: number): Promise<QUESTION> => {
    const movesNamesAndIndexes = await getNRandomDifferentMovesNamesAndIndexes(1);
    const moveName = movesNamesAndIndexes[0].move;
    const move = await getMoveByName(moveName);
    let correctAnswer = move.power;

    if (correctAnswer === null) {
        correctAnswer = "Variable or Zero";
    }

    const incorrectAnswers = [];
    //We need to generate 3 incorrect numbers that are not equal to the correct answer
    const possibleIncorrectAnswers = ["Variable or Zero", 15, 20, 40, 60, 80, 90, 95, 100, 120, 130, 150];
    while (incorrectAnswers.length < 3) {
        const randomIncorrectAnswer = possibleIncorrectAnswers[Math.floor(Math.random() * possibleIncorrectAnswers.length)];
        if (randomIncorrectAnswer !== correctAnswer && !incorrectAnswers.includes(randomIncorrectAnswer)) {
            incorrectAnswers.push(randomIncorrectAnswer);
        }
    }

    const answers = [];
    //push the correct answer
    answers.push({
        isCorrect: true,
        answerText: correctAnswer === "Variable or Zero" ? "0 (o variable)" : correctAnswer,
        answerImages: [],
        answerAudios: []
    });

    //push the incorrect answers
    for (let i = 0; i < 3; i++) {
        answers.push({
            isCorrect: false,
            answerText: incorrectAnswers[i] === "Variable or Zero" ? "0 (o variable)" : incorrectAnswers[i],
            answerImages: [],
            answerAudios: []
        });
    }

    shuffleArray(answers);


    correctAnswer = correctAnswer === "Variable or Zero" ? "0 (o variable)" : String(correctAnswer);


    const pokemonThatCanLearnMove = await getAllPokemonNamesThatCanLearnMove(moveName, maxPokedexIndex);
    const pokemonImages = await Promise.all(pokemonThatCanLearnMove.map(async pokemon => {
        return await getPokemonImageURL(pokemon.index);
    }));

    return {
        questionText: `¿Cuál es la potencia de ${capitalizeFirstLetter(moveName)}?`,
        questionImages: [],
        questionAudios: [],
        allowsMultipleAnswers: false,
        score: 1,
        onCorrectText: generateOnCorrectPrefix() + `La potencia de ${capitalizeFirstLetter(moveName)} es ${correctAnswer === 'Variable or Zero' ? "0 (o variable)" : correctAnswer}.`,
        onCorrectImages: [...pokemonImages],
        onCorrectAudios: [],
        onIncorrectText: generateOnIncorrectMessage(correctAnswer === 'Variable or Zero' ? "0 (o variable)" : correctAnswer),
        onIncorrectImages: [...pokemonImages],
        onIncorrectAudios: [],
        answers: answers
    }


}

const whatsTheAccuracyOfThisMoveQuestion = async (maxPokedexIndex: number): Promise<QUESTION> => {
    const movesNamesAndIndexes = await getNRandomDifferentMovesNamesAndIndexes(1);
    const moveName = movesNamesAndIndexes[0].move;
    const move = await getMoveByName(moveName);
    let correctAnswer = move.accuracy;

    const beautifyAccuracy = (accuracy: number | string) => {
        if (typeof accuracy === 'number') {
            return `${accuracy}%`;
        } else if (accuracy === "Never Misses") {
            return "Nunca Falla";
        } else {
            return accuracy;
        }
    }

    if (correctAnswer === null) {
        correctAnswer = "Never Misses";
    }

    const incorrectAnswers = [];
    //We need to generate 3 incorrect numbers that are not equal to the correct answer
    const possibleIncorrectAnswers = ["Never Misses", 30, 50, 70, 80, 90, 95, 100];
    while (incorrectAnswers.length < 3) {
        const randomIncorrectAnswer = possibleIncorrectAnswers[Math.floor(Math.random() * possibleIncorrectAnswers.length)];
        if (randomIncorrectAnswer !== correctAnswer && !incorrectAnswers.includes(randomIncorrectAnswer)) {
            incorrectAnswers.push(randomIncorrectAnswer);
        }
    }

    const answers = [];
    //push the correct answer
    answers.push({
        isCorrect: true,
        answerText: correctAnswer,
        answerImages: [],
        answerAudios: []
    });

    //push the incorrect answers
    for (let i = 0; i < 3; i++) {
        answers.push({
            isCorrect: false,
            answerText: incorrectAnswers[i],
            answerImages: [],
            answerAudios: []
        });
    }

    shuffleArray(answers);

    const onCorrectText = correctAnswer === "Never Misses"
        ?
        generateOnCorrectPrefix() + `¡El movimiento ${capitalizeFirstLetter(moveName)} nunca falla!`
        :
        generateOnCorrectPrefix() + `La precisión de ${capitalizeFirstLetter(moveName)} es del ${correctAnswer}%.`;

    const beautifiedStringAnswers = answers.map(answer => beautifyAccuracy(answer.answerText));
    const beautifiedAnswers = answers.map((answer, i) => {
        return {
            isCorrect: answer.isCorrect,
            answerText: beautifiedStringAnswers[i],
            answerImages: [],
            answerAudios: []
        }
    });

    //the one that answer.isCorrect  is the correct answer
    const correctBeautifiedAnswer = beautifiedAnswers.find(answer => answer.isCorrect)?.answerText;

    const onIncorrectText = correctBeautifiedAnswer === "Never Misses"
        ?
        `El movimiento ${capitalizeFirstLetter(moveName)} nunca falla.`
        :
        `La precisión de ${capitalizeFirstLetter(moveName)} es del ${correctBeautifiedAnswer}.`;



    const pokemonThatCanLearnMove = await getAllPokemonNamesThatCanLearnMove(moveName, maxPokedexIndex);
    const pokemonImages = await Promise.all(pokemonThatCanLearnMove.map(async pokemon => {
        return await getPokemonImageURL(pokemon.index);
    }));


    return {
        questionText: `¿Cuál es la precisión de ${capitalizeFirstLetter(moveName)}?`,
        questionImages: [],
        questionAudios: [],
        allowsMultipleAnswers: false,
        score: 1,
        onCorrectText: onCorrectText,
        onCorrectImages: [...pokemonImages],
        onCorrectAudios: [],
        onIncorrectText: generateOnIncorrectMessage(onIncorrectText),
        onIncorrectImages: [...pokemonImages],
        onIncorrectAudios: [],
        answers: beautifiedAnswers
    }
}

const generateSelectTheCorrectCryForThisPokemonQuestion = async (maxPokedexIndex: number): Promise<QUESTION> => {
    const randomIndexes = generateNDifferentRandomNumbers(4, 1, maxPokedexIndex);
    const correctAnswerIndex = Math.floor(Math.random() * 4);
    const pokemonName = await fetchPokemonName(randomIndexes[correctAnswerIndex]);
    const correctAnswerAudio = getPokemonCryURL(randomIndexes[correctAnswerIndex]);
    const answers = [];
    for (let i = 0; i < 4; i++) {
        answers.push({
            isCorrect: i === correctAnswerIndex,
            answerText: "",
            answerImages: [],
            answerAudios: [getPokemonCryURL(randomIndexes[i])]
        });
    }


    const onIncorrectText = `el audio número ${correctAnswerIndex + 1}`;

    return {
        questionText: `¿Cuál de estos gritos pertenece a ${capitalizeFirstLetter(pokemonName)}?`,
        questionImages: [await getPokemonImageURL(randomIndexes[correctAnswerIndex])],
        questionAudios: [],
        allowsMultipleAnswers: false,
        score: 1,
        onCorrectText: generateOnCorrectPrefix() + await generatePokemonTrivia(randomIndexes[correctAnswerIndex]),
        onCorrectImages: [await getPokemonImageURL(randomIndexes[correctAnswerIndex])],
        onCorrectAudios: [correctAnswerAudio],
        onIncorrectText: generateOnIncorrectMessage(onIncorrectText),
        onIncorrectImages: [await getPokemonImageURL(randomIndexes[correctAnswerIndex])],
        onIncorrectAudios: [correctAnswerAudio],
        answers: answers
    }
}

const generateHasThisPokemonGenderDifferenceQuestion = async (maxPokedexIndex: number): Promise<QUESTION> => {
    const pokemonNamesAndIndexes = await getRandomPokemonNamesAndIndexes(1, maxPokedexIndex);
    const pokemonIndex = pokemonNamesAndIndexes[0].index;
    const pokemonName = pokemonNamesAndIndexes[0].name;
    const pokemon = await fetchPokemon(pokemonIndex);

    const maleFrontSprite = pokemon.sprites.front_default;
    const maleBackSprite = pokemon.sprites.back_default;
    let femaleFrontSprite = pokemon.sprites.front_female;
    let femaleBackSprite = pokemon.sprites.back_female;

    const hasGenderDifference = await hasThisPokemonGenderDifference(pokemonIndex);
    const hasGender = hasThisPokemonGender(pokemonIndex)
    const correctAnswer = hasGenderDifference ? "Sí" : "No";
    const incorrectAnswer = hasGenderDifference ? "No" : "Sí";


    femaleFrontSprite = femaleFrontSprite || maleFrontSprite; //if femaleFrontSprite is null, use maleFrontSprite
    femaleBackSprite = femaleBackSprite || maleBackSprite; //if femaleBackSprite is null, use maleBackSprite



    const answers = [
        {
            isCorrect: true,
            answerText: correctAnswer,
            answerImages: [],
            answerAudios: []
        },
        {
            isCorrect: false,
            answerText: incorrectAnswer,
            answerImages: [],
            answerAudios: []
        }
    ];



    const onCorrectText = !hasGender
        ? `${capitalizeFirstLetter(pokemonName)} no tiene género, así que no puede tener diferencias de género. `
        :

        !hasGenderDifference ? generateOnCorrectPrefix() + `¡${capitalizeFirstLetter(pokemonName)} no tiene diferencia de género!`
            : generateOnCorrectPrefix() + `¡${capitalizeFirstLetter(pokemonName)} tiene diferencia de género!`
    const onIncorrectText =
        !hasGender
            ? `¡${capitalizeFirstLetter(pokemonName)} no tiene género, así que no puede tener diferencias de género!`
            :
            !hasGenderDifference ? `¡${capitalizeFirstLetter(pokemonName)} no tiene diferencia de género!`
                : `¡${capitalizeFirstLetter(pokemonName)} tiene diferencia de género!`

    return {
        questionText: `¿${capitalizeFirstLetter(pokemonName)} tiene diferencia de género?`,
        questionImages: [maleFrontSprite],
        questionAudios: [],
        allowsMultipleAnswers: false,
        score: 1,
        onCorrectText: onCorrectText,
        onCorrectImages: [maleFrontSprite, maleBackSprite, '', '', femaleFrontSprite, femaleBackSprite],
        onCorrectAudios: [],
        onIncorrectText: generateOnIncorrectMessage(onIncorrectText),
        onIncorrectImages: [maleFrontSprite, maleBackSprite, '', '', femaleFrontSprite, femaleBackSprite],
        onIncorrectAudios: [],
        answers: answers
    }
}


const generateWhatIsTheTargetOfThisMoveQuestion = async (maxPokedexIndex: number): Promise<QUESTION> => {


    const beautifyPossibleAnswers = (possibleAnswers: string[]) => {
        return possibleAnswers.map(answer => {
            switch (answer) {
                case "selected-pokemon":
                    return "Un Pokémon que selecciones";
                case "user":
                    return "El usuario";
                case "entire-field":
                    return "El Campo entero";
                case "all-pokemon":
                    return "Todos los Pokémon";
                case "all-opponents":
                    return "Todos los oponentes";
                case "users-field":
                    return "El Campo del usuario";
                case "opponents-field":
                    return "El Campo de los oponentes";
                case "random-opponent":
                    return "Un oponente al azar";
                case "ally":
                    return "Un aliado";
                case "all-other-pokemon":
                    return "Todos los demás Pokémon";
                case "selected-pokemon-me-first":
                    return "El Pokémon seleccionado *";
                default:
                    return answer;
            }
        });
    }

    const movesNamesAndIndexes = await getNRandomDifferentMovesNamesAndIndexes(1);
    const moveName = movesNamesAndIndexes[0].move;
    const correctAnswer = await getTargetOfMove(moveName);
    const possibleAnswers = ["selected-pokemon", "random-opponent", "user", "entire-field", "all-pokemon", "all-opponents", "users-field", "opponents-field", "users-field", "ally", "all-other-pokemon"];
    const incorrectAnswers = possibleAnswers.filter(answer => answer !== correctAnswer);
    const answers = [];
    //push the correct answer
    answers.push({
        isCorrect: true,
        answerText: correctAnswer,
        answerImages: [],
        answerAudios: []
    });

    //shuffle the incorrect answers
    shuffleArray(incorrectAnswers);

    //push the incorrect answers

    for (let i = 0; i < 3; i++) {
        answers.push({
            isCorrect: false,
            answerText: incorrectAnswers[i],
            answerImages: [],
            answerAudios: []
        });
    }

    shuffleArray(answers);

    const beautifiedStringAnswers = beautifyPossibleAnswers(answers.map(answer => answer.answerText));
    const beautifiedAnswers = answers.map((answer, i) => {
        return {
            isCorrect: answer.isCorrect,
            answerText: beautifiedStringAnswers[i],
            answerImages: [],
            answerAudios: []
        }
    });

    //the one that answer.isCorrect  is the correct answer
    const correctBeautifiedAnswer = beautifiedAnswers.find(answer => answer.isCorrect)?.answerText;

    //get all pokemon that can learn the move
    const pokemonThatCanLearnMove = await getAllPokemonNamesThatCanLearnMove(moveName, maxPokedexIndex);
    const pokemonImages = await Promise.all(pokemonThatCanLearnMove.map(async pokemon => {
        return await getPokemonImageURL(pokemon.index);
    }));

    return {
        questionText: `¿Cuál es el objetivo del ataque ${capitalizeFirstLetter(moveName)}?`,
        questionImages: [],
        questionAudios: [],
        allowsMultipleAnswers: false,
        score: 1,
        onCorrectText: generateOnCorrectPrefix() + `El objetivo de ${capitalizeFirstLetter(moveName)} es ${smallLetterFirstLetter(correctBeautifiedAnswer)}.`,
        onCorrectImages: [...pokemonImages],
        onCorrectAudios: [],
        onIncorrectText: generateOnIncorrectMessage(correctBeautifiedAnswer),
        onIncorrectImages: [...pokemonImages],
        onIncorrectAudios: [],
        answers: beautifiedAnswers
    }

}

const generateWhichOfThesePokemonIsTheFastestOneQuestion = async (maxPokedexIndex: number): Promise<QUESTION> => {
    const pokemonNamesAndIndexes = await getRandomPokemonNamesAndIndexes(4, maxPokedexIndex);

    //get the speed of each pokemon
    const pokemonSpeeds = await Promise.all(pokemonNamesAndIndexes.map(pokemon => getPokemonSpeed(pokemon.index)));
    //find the index of the pokemon(s) with the highest speed, there can be a tie and all pokemon with the highest speed will be considered correct answers
    const maxSpeed = Math.max(...pokemonSpeeds);

    //find the highest speed stat
    const highestSpeedStat = pokemonSpeeds.reduce((max, speed) => Math.max(max, speed), 0);
    //all indexes such that pokemonSpeeds[index] === highestSpeedStat
    const correctAnswerIndexes = pokemonSpeeds
        .map((speed, index) => speed === highestSpeedStat ? index : -1)
        .filter(index => index !== -1);

    const answers = [];
    const correctAnswers = [];
    let incorrectPairPokemonSpeed = []
    for (let i = 0; i < pokemonNamesAndIndexes.length; i++) {
        answers.push({
            isCorrect: correctAnswerIndexes.includes(i),
            answerText: capitalizeFirstLetter(pokemonNamesAndIndexes[i].name),
            answerImages: [await getPokemonImageURL(pokemonNamesAndIndexes[i].index)],
            answerAudios: []
        });
        if (correctAnswerIndexes.includes(i)) {
            correctAnswers.push({
                isCorrect: true,
                answerText: capitalizeFirstLetter(pokemonNamesAndIndexes[i].name),
                answerImages: [await getPokemonImageURL(pokemonNamesAndIndexes[i].index)],
                answerAudios: []
            });
        } else {
            const pokemonName = capitalizeFirstLetter(pokemonNamesAndIndexes[i].name);
            const speed = pokemonSpeeds[i];
            incorrectPairPokemonSpeed.push(`${speed} (${pokemonName})`);
        }
    }


    //order incorrectPairPokemonSpeed by speed larger to smaller
    incorrectPairPokemonSpeed.sort((a, b) => {
        const speedA = parseInt(a.split(' ')[0]);
        const speedB = parseInt(b.split(' ')[0]);
        return speedB - speedA;
    }
    );
    //

    shuffleArray(answers);
    const onCorrectText = correctAnswerIndexes.length === 1
        ? `El Pokémon más rápido es ${capitalizeFirstLetter(pokemonNamesAndIndexes[correctAnswerIndexes[0]].name)} con una velocidad de ${maxSpeed}, mientras que 
los demás tienen una velocidad de: ${incorrectPairPokemonSpeed.join(', ')}.`
        : `Los Pokémon más rápidos son ${correctAnswers.map(answer => answer.answerText).join(', ')} con una velocidad de ${maxSpeed}, mientras que los demás tienen una velocidad de ${incorrectPairPokemonSpeed.join(', ')}.`;

    return {
        questionText: `¿Cuál(es) de estos Pokémon es/son el/los más rápido(s)?`,
        questionImages: [],
        questionAudios: [],
        allowsMultipleAnswers: true,
        score: 1,
        onCorrectText: onCorrectText,
        onCorrectImages: correctAnswers.map(answer => answer.answerImages[0]),
        onCorrectAudios: [],
        onIncorrectText: generateOnIncorrectMessage(onCorrectText),
        onIncorrectImages: correctAnswers.map(answer => answer.answerImages[0]),
        onIncorrectAudios: [],
        answers: answers
    }
}

const generateWhatDoesThisMoveDoQuestion = async (maxPokedexIndex: number): Promise<QUESTION> => {

    const movesNamesAndIndexes = await getNRandomDifferentMovesNamesAndIndexes(1);
    const moveName = movesNamesAndIndexes[0].move;
    const moveDescription = await getMoveDescriptionByName(moveName);

    if (moveDescription) {

        //get other 3 random moves descriptions
        const allMovesNames = await getAllMovesNames();
        const incorrectMovesNames = allMovesNames.filter(move => move !== moveName);

        const incorrectMovesDescriptions: string[]
            = [];
        while (incorrectMovesDescriptions.length < 3) {
            const randomMoveName = incorrectMovesNames[Math.floor(Math.random() * incorrectMovesNames.length)];
            const randomMoveDescription = await getMoveDescriptionByName(randomMoveName);
            if (randomMoveDescription && !incorrectMovesDescriptions.includes(randomMoveDescription)) {
                incorrectMovesDescriptions.push(randomMoveDescription);
            }
        }

        const answers = [];
        //push the correct answer
        answers.push({
            isCorrect: true,
            answerText: capitalizeFirstLetter(moveDescription),
            answerImages: [],
            answerAudios: []
        });

        //push the incorrect answers
        for (let i = 0; i < 3; i++) {
            answers.push({
                isCorrect: false,
                answerText: capitalizeFirstLetter(incorrectMovesDescriptions[i]),
                answerImages: [],
                answerAudios: []
            });
        }

        shuffleArray(answers);

        const pokemonThatCanLearnMove = await getAllPokemonNamesThatCanLearnMove(moveName, maxPokedexIndex);
        const pokemonImages = await Promise.all(pokemonThatCanLearnMove.map(async pokemon => {
            return await getPokemonImageURL(pokemon.index);
        }));

        return {
            questionText: `¿Qué hace el movimiento ${capitalizeFirstLetter(moveName)}?`,
            questionImages: [],
            questionAudios: [],
            allowsMultipleAnswers: false,
            score: 1,
            onCorrectText: generateOnCorrectPrefix() + `"${capitalizeFirstLetter(moveName)}: ${capitalizeFirstLetter(moveDescription)}."`,
            onCorrectImages: [...pokemonImages],
            onCorrectAudios: [],
            onIncorrectText: generateOnIncorrectMessage(`"${capitalizeFirstLetter(moveName)}: ${capitalizeFirstLetter(moveDescription)}."`),
            onIncorrectImages: [...pokemonImages],
            onIncorrectAudios: [],
            answers: answers
        }
    } else {
        await generateWhatDoesThisMoveDoQuestion(maxPokedexIndex);
    }


}
const whatsTheMultiplierDamageOfMoveTypeAgainsTypeCombination = async (): Promise<QUESTION> => {
    const types = await getAllTypesNames();
    const randomType1 = types[Math.floor(Math.random() * types.length)];
    const randomType2 = types[Math.floor(Math.random() * types.length)];
    const moveType = types[Math.floor(Math.random() * types.length)];
    console.log(`The attacking move type is ${moveType}`);

    //if randomType1 and randomType2 are the same, we only need to check the effectiveness of the move against one of them
    const defenseTypes: string[] = [];
    if (randomType1 === randomType2) {
        defenseTypes.push(randomType1);
    }
    else {
        defenseTypes.push(randomType1);
        defenseTypes.push(randomType2);
    }
    console.log(`The defense types are ${defenseTypes}`);

    let multiplier = await checkEffectiveness(moveType, defenseTypes);
    console.log(`The multiplier is ${multiplier}`);
    const possibleAnswers = ["Hace daño neutro.", "No le afecta.", "Es súpereficaz (x4).", "No es muy eficaz (/4).", "Es súpereficaz (x2).", "No es muy eficaz (/2)."];

    const incorrectAnswers = possibleAnswers.filter(answer => answer !== multiplier);
    const answers = [];
    //push the correct answer
    answers.push({
        isCorrect: true,
        answerText: multiplier,
        answerImages: [],
        answerAudios: []
    });

    //shuffle the incorrect answers
    shuffleArray(incorrectAnswers);

    //push the incorrect answers

    for (let i = 0; i < 3; i++) {
        answers.push({
            isCorrect: false,
            answerText: incorrectAnswers[i],
            answerImages: [],
            answerAudios: []
        });
    }

    shuffleArray(answers);
    console.log(`The possible answers are ${answers.map(answer => answer.answerText)}`);



    //translate the defense types to spanish
    const defenseTypesString = defenseTypes.map(type => translateTypeNameToSpanish(type)).join(" y ");
    console.log(`The defense types string is ${defenseTypesString}`);

    //translate the move type to spanish
    const moveTypeString = translateTypeNameToSpanish(moveType);
    console.log(`The move type string is ${moveTypeString}`);

    //defenseTypes.map(async type => await getTypeStprite(type))
    const defenseTypesImages = await Promise.all(defenseTypes.map(async type => await getTypeStprite(type)));
    return {
        questionText: `A ver si te sabes la tabla de tipos 😠`,
        questionImages: [...defenseTypesImages, "https://www.svgrepo.com/show/396238/crossed-swords.svg", await getTypeStprite(moveType)],
        questionAudios: [],
        allowsMultipleAnswers: false,
        score: 1,
        onCorrectText: generateOnCorrectPrefix() + `Un ataque de tipo ${moveTypeString} contra un Pokémon de tipo ${defenseTypesString} ${smallLetterFirstLetter(multiplier)}`,
        onCorrectImages: [await getTypeStprite(moveType), "https://www.svgrepo.com/show/396238/crossed-swords.svg", ...defenseTypesImages],
        onCorrectAudios: [],
        onIncorrectText: generateOnIncorrectMessage(multiplier),
        onIncorrectImages: [await getTypeStprite(moveType), "https://www.svgrepo.com/show/396238/crossed-swords.svg", ...defenseTypesImages],
        onIncorrectAudios: [],
        answers: answers
    }
}

const generateWhichPokemonHasHighestBaseHPQuestion = async (maxPokedexIndex: number): Promise<QUESTION> => {



    const pokemonNamesAndIndexes = await getRandomPokemonNamesAndIndexes(4, maxPokedexIndex);
    //get the base HP of each pokemon
    const pokemonBaseHPs = await Promise.all(pokemonNamesAndIndexes.map(pokemon => getPokemonBaseHP(pokemon.index)));
    //find the index of the pokemon(s) with the highest base HP, there can be a tie and all pokemon with the highest base HP will be considered correct answers
    const maxBaseHP = Math.max(...pokemonBaseHPs);
    //find the highest base HP
    const highestBaseHPStat = pokemonBaseHPs.reduce((max, hp) => Math.max(max, hp), 0);
    //all indexes such that pokemonBaseHPs[index] === highestBaseHPStat
    const correctAnswerIndexes = pokemonBaseHPs
        .map((hp, index) => hp === highestBaseHPStat ? index : -1)
        .filter(index => index !== -1);
    const answers = [];
    const correctAnswers = [];
    let incorrectPairPokemonBaseHP = []
    for (let i = 0; i < pokemonNamesAndIndexes.length; i++) {
        answers.push({
            isCorrect: correctAnswerIndexes.includes(i),
            answerText: capitalizeFirstLetter(pokemonNamesAndIndexes[i].name),
            answerImages: [await getPokemonImageURL(pokemonNamesAndIndexes[i].index)],
            answerAudios: []
        });
        if (correctAnswerIndexes.includes(i)) {
            correctAnswers.push({
                isCorrect: true,
                answerText: capitalizeFirstLetter(pokemonNamesAndIndexes[i].name),
                answerImages: [await getPokemonImageURL(pokemonNamesAndIndexes[i].index)],
                answerAudios: []
            });
        } else {
            const pokemonName = capitalizeFirstLetter(pokemonNamesAndIndexes[i].name);
            const hp = pokemonBaseHPs[i];
            incorrectPairPokemonBaseHP.push(`${hp} (${pokemonName})`);
        }
    }
    //order incorrectPairPokemonBaseHP by base HP larger to smaller
    incorrectPairPokemonBaseHP.sort((a, b) => {
        const hpA = parseInt(a.split(' ')[0]);
        const hpB = parseInt(b.split(' ')[0]);
        return hpB - hpA;
    }
    );

    shuffleArray(answers);
    const onCorrectText = correctAnswerIndexes.length === 1
        ? `El Pokémon con más PS es ${capitalizeFirstLetter(pokemonNamesAndIndexes[correctAnswerIndexes[0]].name)} con ${maxBaseHP} PS, mientras que
los demás tienen: ${incorrectPairPokemonBaseHP.join(', ')}.`
        : `Los Pokémon con más PS son ${correctAnswers.map(answer => answer.answerText).join(', ')} con ${maxBaseHP} PS, mientras que los demás tienen: ${incorrectPairPokemonBaseHP.join(', ')}.`;
    return {
        questionText: `¿Cuál(es) de estos Pokémon tiene/ tienen más PS?`,
        questionImages: [],
        questionAudios: [],
        allowsMultipleAnswers: true,
        score: 1,
        onCorrectText: onCorrectText,
        onCorrectImages: correctAnswers.map(answer => answer.answerImages[0]),
        onCorrectAudios: [],
        onIncorrectText: generateOnIncorrectMessage(onCorrectText),
        onIncorrectImages: correctAnswers.map(answer => answer.answerImages[0]),
        onIncorrectAudios: [],
        answers: answers
    }
}

const generateWhichPokemonHasHighestBaseAttackQuestion = async (maxPokedexIndex: number): Promise<QUESTION> => {


    const pokemonNamesAndIndexes = await getRandomPokemonNamesAndIndexes(4, maxPokedexIndex);
    //get the base Attack of each pokemon
    const pokemonBaseAttacks = await Promise.all(pokemonNamesAndIndexes.map(pokemon => getPokemonBaseAttack(pokemon.index)));
    //find the index of the pokemon(s) with the highest base Attack, there can be a tie and all pokemon with the highest base Attack will be considered correct answers
    const maxBaseAttack = Math.max(...pokemonBaseAttacks);
    //find the highest base Attack
    const highestBaseAttackStat = pokemonBaseAttacks.reduce((max, attack) => Math.max(max, attack), 0);
    //all indexes such that pokemonBaseAttacks[index] === highestBaseAttackStat
    const correctAnswerIndexes = pokemonBaseAttacks
        .map((attack, index) => attack === highestBaseAttackStat ? index : -1)
        .filter(index => index !== -1);
    const answers = [];
    const correctAnswers = [];
    let incorrectPairPokemonBaseAttack = []
    for (let i = 0; i < pokemonNamesAndIndexes.length; i++) {
        answers.push({
            isCorrect: correctAnswerIndexes.includes(i),
            answerText: capitalizeFirstLetter(pokemonNamesAndIndexes[i].name),
            answerImages: [await getPokemonImageURL(pokemonNamesAndIndexes[i].index)],
            answerAudios: []
        });
        if (correctAnswerIndexes.includes(i)) {
            correctAnswers.push({
                isCorrect: true,
                answerText: capitalizeFirstLetter(pokemonNamesAndIndexes[i].name),
                answerImages: [await getPokemonImageURL(pokemonNamesAndIndexes[i].index)],
                answerAudios: []
            });
        } else {
            const pokemonName = capitalizeFirstLetter(pokemonNamesAndIndexes[i].name);
            const attack = pokemonBaseAttacks[i];
            incorrectPairPokemonBaseAttack.push(`${attack} (${pokemonName})`);
        }
    }
    //order incorrectPairPokemonBaseAttack by base Attack larger to smaller
    incorrectPairPokemonBaseAttack.sort((a, b) => {
        const attackA = parseInt(a.split(' ')[0]);
        const attackB = parseInt(b.split(' ')[0]);
        return attackB - attackA;
    });

    shuffleArray(answers);

    const onCorrectText = correctAnswerIndexes.length === 1
        ? `El Pokémon con más Ataque es ${capitalizeFirstLetter(pokemonNamesAndIndexes[correctAnswerIndexes[0]].name)} con ${maxBaseAttack} de Ataque, mientras que
los demás tienen: ${incorrectPairPokemonBaseAttack.join(', ')}.`
        : `Los Pokémon con más Ataque son ${correctAnswers.map(answer => answer.answerText).join(', ')} con ${maxBaseAttack} de Ataque, mientras que los demás tienen: ${incorrectPairPokemonBaseAttack.join(', ')}.`;
    return {
        questionText: `¿Cuál(es) de estos Pokémon tiene/ tienen más Ataque?`,
        questionImages: [],
        questionAudios: [],
        allowsMultipleAnswers: true,
        score: 1,
        onCorrectText: onCorrectText,
        onCorrectImages: correctAnswers.map(answer => answer.answerImages[0]),
        onCorrectAudios: [],
        onIncorrectText: generateOnIncorrectMessage(onCorrectText),
        onIncorrectImages: correctAnswers.map(answer => answer.answerImages[0]),
        onIncorrectAudios: [],
        answers: answers
    }
}

const generateWhichPokemonHasHighestBaseDefenseQuestion = async (maxPokedexIndex: number): Promise<QUESTION> => {

    const pokemonNamesAndIndexes = await getRandomPokemonNamesAndIndexes(4, maxPokedexIndex);
    //get the base Defense of each pokemon
    const pokemonBaseDefenses = await Promise.all(pokemonNamesAndIndexes.map(pokemon => getPokemonBaseDefense(pokemon.index)));
    //find the index of the pokemon(s) with the highest base Defense, there can be a tie and all pokemon with the highest base Defense will be considered correct answers
    const maxBaseDefense = Math.max(...pokemonBaseDefenses);
    //find the highest base Defense
    const highestBaseDefenseStat = pokemonBaseDefenses.reduce((max, defense) => Math.max(max, defense), 0);
    //all indexes such that pokemonBaseDefenses[index] === highestBaseDefenseStat
    const correctAnswerIndexes = pokemonBaseDefenses
        .map((defense, index) => defense === highestBaseDefenseStat ? index : -1)
        .filter(index => index !== -1);
    const answers = [];
    const correctAnswers = [];
    let incorrectPairPokemonBaseDefense = []
    for (let i = 0; i < pokemonNamesAndIndexes.length; i++) {
        answers.push({
            isCorrect: correctAnswerIndexes.includes(i),
            answerText: capitalizeFirstLetter(pokemonNamesAndIndexes[i].name),
            answerImages: [await getPokemonImageURL(pokemonNamesAndIndexes[i].index)],
            answerAudios: []
        });
        if (correctAnswerIndexes.includes(i)) {
            correctAnswers.push({
                isCorrect: true,
                answerText: capitalizeFirstLetter(pokemonNamesAndIndexes[i].name),
                answerImages: [await getPokemonImageURL(pokemonNamesAndIndexes[i].index)],
                answerAudios: []
            });
        } else {
            const pokemonName = capitalizeFirstLetter(pokemonNamesAndIndexes[i].name);
            const defense = pokemonBaseDefenses[i];
            incorrectPairPokemonBaseDefense.push(`${defense} (${pokemonName})`);
        }
    }
    //order incorrectPairPokemonBaseDefense by base Defense larger to smaller
    incorrectPairPokemonBaseDefense.sort((a, b) => {
        const defenseA = parseInt(a.split(' ')[0]);
        const defenseB = parseInt(b.split(' ')[0]);
        return defenseB - defenseA;
    }
    );

    shuffleArray(answers);

    const onCorrectText = correctAnswerIndexes.length === 1
        ? `El Pokémon con más Defensa es ${capitalizeFirstLetter(pokemonNamesAndIndexes[correctAnswerIndexes[0]].name)} con ${maxBaseDefense} de Defensa, mientras que
los demás tienen: ${incorrectPairPokemonBaseDefense.join(', ')}.`
        : `Los Pokémon con más Defensa son ${correctAnswers.map(answer => answer.answerText).join(', ')} con ${maxBaseDefense} de Defensa, mientras que los demás tienen: ${incorrectPairPokemonBaseDefense.join(', ')}.`;
    return {
        questionText: `¿Cuál(es) de estos Pokémon tiene/ tienen más Defensa?`,
        questionImages: [],
        questionAudios: [],
        allowsMultipleAnswers: true,
        score: 1,
        onCorrectText: onCorrectText,
        onCorrectImages: correctAnswers.map(answer => answer.answerImages[0]),
        onCorrectAudios: [],
        onIncorrectText: generateOnIncorrectMessage(onCorrectText),
        onIncorrectImages: correctAnswers.map(answer => answer.answerImages[0]),
        onIncorrectAudios: [],
        answers: answers
    }
}

const generateHowMuchDoesThisPokemonWeighQuestion = async (maxPokedexIndex: number): Promise<QUESTION> => {
    //get a random pokemon
    const randomIndex = Math.floor(Math.random() * maxPokedexIndex) + 1;
    const pokemonName = await fetchPokemonName(randomIndex);
    const pokemon = await fetchPokemon(randomIndex);
    const pokemonWeight = pokemon.weight / 10; //weight is in hectograms, we convert it to kilograms
    const correctAnswer = pokemonWeight.toString() + ' kg';
    const incorrectAnswers: string[] = [];
    //try to make pairs of weights that are not the same weight as the pokemon
    while (incorrectAnswers.length < 3) {
        const randomWeight = String(Math.round(Math.random() * pokemon.weight + Math.random() * 10) / 10) + ' kg';
        if (randomWeight.toString() !== correctAnswer && !incorrectAnswers.includes(randomWeight)) {
            incorrectAnswers.push(randomWeight.toString());
        }
    }
    const answers = [];
    //push the correct answer
    answers.push({
        isCorrect: true,
        answerText: correctAnswer,
        answerImages: [],
        answerAudios: []
    });

    //push the incorrect answers
    for (let i = 0; i < 3; i++) {
        answers.push({
            isCorrect: false,
            answerText: incorrectAnswers[i],
            answerImages: [],
            answerAudios: []
        });
    }

    shuffleArray(answers);

    const onCorrectText = generateOnCorrectPrefix() + `El Pokémon ${capitalizeFirstLetter(pokemonName)} pesa ${correctAnswer}.`;
    const onIncorrectText = `El Pokémon ${capitalizeFirstLetter(pokemonName)} pesa ${correctAnswer}.`;
    return {
        questionText: `¿Cuánto pesa ${capitalizeFirstLetter(pokemonName)}?`,
        questionImages: [await getPokemonImageURL(randomIndex)],
        questionAudios: [],
        allowsMultipleAnswers: false,
        score: 1,
        onCorrectText: onCorrectText,
        onCorrectImages: [await getPokemonImageURL(randomIndex)],
        onCorrectAudios: [],
        onIncorrectText: generateOnIncorrectMessage(onIncorrectText),
        onIncorrectImages: [await getPokemonImageURL(randomIndex)],
        onIncorrectAudios: [],
        answers: answers
    }
}

const generateHasThisPokemonHigherAttackOrSpecialAttackQuestion = async (maxPokedexIndex: number): Promise<QUESTION> => {
    const pokemonNamesAndIndexes = await getRandomPokemonNamesAndIndexes(1, maxPokedexIndex);
    const pokemonIndex = pokemonNamesAndIndexes[0].index;
    const pokemonName = pokemonNamesAndIndexes[0].name;
    const pokemon = await fetchPokemon(pokemonIndex);
    const pokemonAttack = await getPokemonBaseAttack(pokemonIndex);
    const pokemonSpecialAttack = await getPokemonBaseSpecialAttack(pokemonIndex);
    const options = ["Ataque", "Ataque Especial", "El mismo"];
    const correctAnswer = pokemonAttack > pokemonSpecialAttack
        ? "Ataque"
        : pokemonSpecialAttack > pokemonAttack ? "Ataque Especial" : "El mismo";
    const [incorrectAnswer, thirdIncorrectAnswer] = options.filter(option => option !== correctAnswer);
    const answers = [
        {
            isCorrect: true,
            answerText: correctAnswer,
            answerImages: [],
            answerAudios: []
        },
        {
            isCorrect: false,
            answerText: incorrectAnswer,
            answerImages: [],
            answerAudios: []
        },
        {
            isCorrect: false,
            answerText: thirdIncorrectAnswer,
            answerImages: [],
            answerAudios: []
        }
    ];

    const onCorrectText = pokemonAttack > pokemonSpecialAttack
        ? generateOnCorrectPrefix() + `¡${capitalizeFirstLetter(pokemonName)} tiene más Ataque (${pokemonAttack} de Ataque y ${pokemonSpecialAttack} de Ataque Especial)
    !`
        : pokemonSpecialAttack > pokemonAttack
            ? generateOnCorrectPrefix() + `¡${capitalizeFirstLetter(pokemonName)} tiene más Ataque Especial (${pokemonSpecialAttack} de Ataque Especial y ${pokemonAttack} de Ataque)
    !`
            : generateOnCorrectPrefix() + `¡${capitalizeFirstLetter(pokemonName)} tiene el mismo Ataque y Ataque Especial (${pokemonAttack} de Ataque y ${pokemonSpecialAttack} de Ataque Especial)
    !`;

    //generate the onIncorrectText
    const onIncorrectText = pokemonAttack > pokemonSpecialAttack
        ? `${capitalizeFirstLetter(pokemonName)} tiene más Ataque (${pokemonAttack} de Ataque y ${pokemonSpecialAttack} de Ataque Especial).`
        : pokemonSpecialAttack > pokemonAttack
            ? `${capitalizeFirstLetter(pokemonName)} tiene más Ataque Especial (${pokemonSpecialAttack} de Ataque Especial y ${pokemonAttack} de Ataque).`
            : `${capitalizeFirstLetter(pokemonName)} tiene el mismo Ataque y Ataque Especial (${pokemonAttack} de Ataque y ${pokemonSpecialAttack} de Ataque Especial).`;

    return {
        questionText: `¿${capitalizeFirstLetter(pokemonName)} tiene más Ataque o Ataque Especial?`,
        questionImages: [pokemon.sprites.front_default],
        questionAudios: [],
        allowsMultipleAnswers: false,
        score: 1,
        onCorrectText: onCorrectText,
        onCorrectImages: [await getPokemonImageURL(pokemonIndex)],
        onCorrectAudios: [],
        onIncorrectText: generateOnIncorrectMessage(onIncorrectText),
        onIncorrectImages: [await getPokemonImageURL(pokemonIndex)],
        onIncorrectAudios: [],
        answers: answers
    }
}

/*
  "pal_park_encounters": [
    {
      "area": {
        "name": "field",
        "url": "https://pokeapi.co/api/v2/pal-park-area/2/"
      },
      "base_score": 70,
      "rate": 20
    }
  ],
*/

const generateInWhichPalParkAreaCanYouFindThisPokemonQuestion = async (maxPokedexIndex: number): Promise<QUESTION> => {

    const allPalParkAreas = ["pond", "field", "forest", "mountain", "sea"];
    const translatedPalParkAreas = ["Zona Pantanosa", "Zona Pradera", "Zona Boscosa", "Zona Rocosa", "Zona Marina"];
    const randomIndex = Math.floor(Math.random() * maxPokedexIndex) + 1;
    const pokemonName = await fetchPokemonName(randomIndex);
    const pokemon = await getPokemonSpecies(randomIndex);
    console.log(`The pokemon name is ${pokemonName}, with index ${randomIndex}`);
    const palParkAreas = pokemon.pal_park_encounters[0]?.area.name ? pokemon.pal_park_encounters[0].area.name : null;
    console.log(`The pal park area of ${pokemonName} is ${palParkAreas}`);
    const correctAnswer = palParkAreas.length > 0 ? palParkAreas : allPalParkAreas[Math.floor(Math.random() * allPalParkAreas.length)];
    const correctAnswerIndex = allPalParkAreas.indexOf(correctAnswer);
    const incorrectAnswers = allPalParkAreas.filter(area => area !== correctAnswer);
    const answers = [];
    //push the correct answer
    answers.push({
        isCorrect: true,
        answerText: translatedPalParkAreas[correctAnswerIndex],
        answerImages: [],
        answerAudios: []
    });
    //shuffle the incorrect answers
    shuffleArray(incorrectAnswers);
    //push the incorrect answers
    for (let i = 0; i < 3; i++) {
        const incorrectAnswerIndex = allPalParkAreas.indexOf(incorrectAnswers[i]);
        answers.push({
            isCorrect: false,
            answerText: translatedPalParkAreas[incorrectAnswerIndex],
            answerImages: [],
            answerAudios: []
        });
    }

    shuffleArray(answers);

    const onCorrectText = generateOnCorrectPrefix() + `El Pokémon ${capitalizeFirstLetter(pokemonName)} se puede encontrar en la Zona ${translatedPalParkAreas[correctAnswerIndex]}.`;
    const onIncorrectText = `El Pokémon ${capitalizeFirstLetter(pokemonName)} se puede encontrar en la Zona ${translatedPalParkAreas[correctAnswerIndex]}.`;
    return {
        questionText: `¿En qué zona del Parque Compi se puede encontrar a ${capitalizeFirstLetter(pokemonName)}?`,
        questionImages: [await getPokemonImageURL(randomIndex)],
        questionAudios: [],
        allowsMultipleAnswers: false,
        score: 1,
        onCorrectText: onCorrectText,
        onCorrectImages: [await getPokemonImageURL(randomIndex)],
        onCorrectAudios: [],
        onIncorrectText: generateOnIncorrectMessage(onIncorrectText),
        onIncorrectImages: [await getPokemonImageURL(randomIndex)],
        onIncorrectAudios: [],
        answers: answers
    }
}

const hasThisPokemonHigherSpecialDefenseOrDefenseQuestion = async (maxPokedexIndex: number): Promise<QUESTION> => {
    const pokemonNamesAndIndexes = await getRandomPokemonNamesAndIndexes(1, maxPokedexIndex);
    const pokemonIndex = pokemonNamesAndIndexes[0].index;
    const pokemonName = pokemonNamesAndIndexes[0].name;
    const pokemon = await fetchPokemon(pokemonIndex);
    const pokemonDefense = await getPokemonBaseDefense(pokemonIndex);
    const pokemonSpecialDefense = await getPokemonBaseSpecialDefense(pokemonIndex);
    const correctAnswer = pokemonDefense > pokemonSpecialDefense
        ? "Defensa"
        : pokemonSpecialDefense === pokemonDefense ? "La misma" : "Defensa Especial";
    const [incorrectAnswer, thirdIncorrectAnswer] = ["Defensa", "Defensa Especial", "La misma"].filter(option => option !== correctAnswer);
    const answers = [
        {
            isCorrect: true,
            answerText: correctAnswer,
            answerImages: [],
            answerAudios: []
        },
        {
            isCorrect: false,
            answerText: incorrectAnswer,
            answerImages: [],
            answerAudios: []
        },
        {
            isCorrect: false,
            answerText: thirdIncorrectAnswer,
            answerImages: [],
            answerAudios: []
        }
    ];
    const onCorrectText = pokemonDefense > pokemonSpecialDefense
        ? generateOnCorrectPrefix() + `¡${capitalizeFirstLetter(pokemonName)} tiene
    más Defensa (${pokemonDefense} de Defensa y ${pokemonSpecialDefense} de Defensa Especial)!`
        : pokemonSpecialDefense > pokemonDefense
            ? generateOnCorrectPrefix() + `¡${capitalizeFirstLetter(pokemonName)} tiene más Defensa Especial (${pokemonSpecialDefense} de Defensa Especial y ${pokemonDefense} de Defensa)!`
            : generateOnCorrectPrefix() + `¡${capitalizeFirstLetter(pokemonName)} tiene la misma Defensa y Defensa Especial (${pokemonDefense} de Defensa y ${pokemonSpecialDefense} de Defensa Especial)!`;

    //generate the onIncorrectText
    const onIncorrectText = pokemonDefense > pokemonSpecialDefense
        ? `${capitalizeFirstLetter(pokemonName)} tiene más Defensa (${pokemonDefense} de Defensa y ${pokemonSpecialDefense} de Defensa Especial).`
        : pokemonSpecialDefense > pokemonDefense
            ? `${capitalizeFirstLetter(pokemonName)} tiene más Defensa Especial (${pokemonSpecialDefense} de Defensa Especial y ${pokemonDefense} de Defensa).`
            : `${capitalizeFirstLetter(pokemonName)} tiene la misma Defensa y Defensa Especial (${pokemonDefense} de Defensa y ${pokemonSpecialDefense} de Defensa Especial).`;
    return {
        questionText: `¿${capitalizeFirstLetter(pokemonName)} tiene más Defensa o Defensa Especial?`,
        questionImages: [pokemon.sprites.front_default],
        questionAudios: [],
        allowsMultipleAnswers: false,
        score: 1,
        onCorrectText: onCorrectText,
        onCorrectImages: [await getPokemonImageURL(pokemonIndex)],
        onCorrectAudios: [],
        onIncorrectText: generateOnIncorrectMessage(onIncorrectText),
        onIncorrectImages: [await getPokemonImageURL(pokemonIndex)],
        onIncorrectAudios: [],
        answers: answers
    }
}


const generateHowTallIsThisPokemonQuestion = async (maxPokedexIndex: number): Promise<QUESTION> => {
    //get a random pokemon
    const randomIndex = Math.floor(Math.random() * maxPokedexIndex) + 1;
    const pokemonName = await fetchPokemonName(randomIndex);
    const pokemon = await fetchPokemon(randomIndex);
    const pokemonHeight = pokemon.height / 10; //height is in decimetres, we convert it to metres
    const correctAnswer = pokemonHeight.toString() + ' m';
    const incorrectAnswers: string[] = [];
    //try to make pairs of heights that are not the same height as the pokemon
    while (incorrectAnswers.length < 3) {

        const randomHeight = String(Math.round(Math.random() * pokemon.height + Math.random() * 10) / 10) + ' m';
        if (randomHeight.toString() !== correctAnswer && incorrectAnswers.indexOf(randomHeight.toString()) === -1) {
            incorrectAnswers.push(randomHeight.toString());
        }
    }
    const answers = [];
    //push the correct answer
    answers.push({
        isCorrect: true,
        answerText: correctAnswer,
        answerImages: [],
        answerAudios: []
    });
    //push the incorrect answers
    for (let i = 0; i < 3; i++) {
        answers.push({
            isCorrect: false,
            answerText: incorrectAnswers[i],
            answerImages: [],
            answerAudios: []
        });
    }
    shuffleArray(answers);
    const onCorrectText = generateOnCorrectPrefix() + `El Pokémon ${capitalizeFirstLetter(pokemonName)} mide ${correctAnswer}.`;
    const onIncorrectText = `El Pokémon ${capitalizeFirstLetter(pokemonName)} mide ${correctAnswer}.`;
    return {
        questionText: `¿Cuánto mide ${capitalizeFirstLetter(pokemonName)}?`,
        questionImages: [await getPokemonImageURL(randomIndex)],
        questionAudios: [],
        allowsMultipleAnswers: false,
        score: 1,
        onCorrectText: onCorrectText,
        onCorrectImages: [await getPokemonImageURL(randomIndex)],
        onCorrectAudios: [],
        onIncorrectText: generateOnIncorrectMessage(onIncorrectText),
        onIncorrectImages: [await getPokemonImageURL(randomIndex)],
        onIncorrectAudios: [],
        answers: answers
    }
}

const generateWhatTypeIsThisPokemonQuestion = async (maxPokedexIndex: number): Promise<QUESTION> => {
    //get a random pokemon
    const randomIndex = Math.floor(Math.random() * maxPokedexIndex) + 1;
    const pokemonName = await fetchPokemonName(randomIndex);
    const pokemonTypes = await getPokemonType(randomIndex);

    const correctAnswer = pokemonTypes.map(type => translateTypeNameToSpanish(type)).join(" y ");
    const allTypesNames1 = await getAllTypesNames();
    const allTypesNames2 = allTypesNames1
    shuffleArray(allTypesNames1);
    shuffleArray(allTypesNames2);

    const incorrectAnswers = [];
    //try to make pairs of types that are not the same type pair as the pokemon
    let candidateWrongAnswer = "";
    while (incorrectAnswers.length < 3) {
        for (let i = 0; i < allTypesNames1.length; i++) {
            for (let j = 0; j < allTypesNames2.length; j++) {
                //if the types are the same, we delete the second type
                let alternativeOrder;

                if (allTypesNames1[i] === allTypesNames2[j]) {
                    candidateWrongAnswer = allTypesNames1[i];
                    alternativeOrder = allTypesNames2[j];
                } else {
                    candidateWrongAnswer = allTypesNames1[i] + " y " + allTypesNames2[j];
                    alternativeOrder = allTypesNames2[j] + " y " + allTypesNames1[i];
                }
                if (!incorrectAnswers.includes(candidateWrongAnswer) && !incorrectAnswers.includes(alternativeOrder) && candidateWrongAnswer !== correctAnswer && alternativeOrder !== correctAnswer) {

                    const random = Math.random();
                    if (i < allTypesNames1.length - 1 && random > 0.4) {
                        i++;
                        console.log(`The incorrect answer pushed is ${candidateWrongAnswer}`);
                        incorrectAnswers.push(candidateWrongAnswer);
                    }
                }
            }
        }

    }

    const answers = [];
    //push the correct answer
    const spritesCorrectAnswer = await Promise.all(pokemonTypes.map(async type => await getTypeStprite(type)));
    const thinkingEmojiList = ["🤔", "🧐", "🤓", "🤨"]

    answers.push({
        isCorrect: true,
        answerText: thinkingEmojiList[0],
        answerImages: spritesCorrectAnswer,
        answerAudios: []
    });

    //shuffle the incorrect answers

    //push the incorrect answers
    for (let i = 0; i < 3; i++) {
        console.log(`The incorrect answer is ${incorrectAnswers[i]}`);
        const types = incorrectAnswers[i].split(" y ");
        const sprites = await Promise.all(types.map(async type => await getTypeStprite(type)));
        answers.push({
            isCorrect: false,
            answerText: thinkingEmojiList[i + 1],
            answerImages: sprites,
            answerAudios: []
        });
    }

    shuffleArray(answers);



    return {
        questionText: `¿Qué tipo(s) es ${capitalizeFirstLetter(pokemonName)}?`,
        questionImages: [await getPokemonImageURL(randomIndex)],
        questionAudios: [],
        allowsMultipleAnswers: false,
        score: 1,
        onCorrectText: generateOnCorrectPrefix() + await generatePokemonTrivia(randomIndex),
        onCorrectImages: [await getPokemonImageURL(randomIndex), ...spritesCorrectAnswer],
        onCorrectAudios: [],
        onIncorrectText: generateOnIncorrectMessage(correctAnswer),
        onIncorrectImages: [await getPokemonImageURL(randomIndex), ...spritesCorrectAnswer],
        onIncorrectAudios: [],
        answers: answers
    }


}

const generateWhatTypeIsThisMoveQuestion = async (maxPokedexIndex: number): Promise<QUESTION> => {
    //get a random move
    const movesNamesAndIndexes = await getNRandomDifferentMovesNamesAndIndexes(1);
    const moveName = movesNamesAndIndexes[0].move;
    const moveType = await getMoveType(moveName);
    const correctAnswer = translateTypeNameToSpanish(moveType);

    const thinkingEmojiList = ["🤔", "🧐", "🤓", "🤨"]
    //get 3 random types that are not the same type as the move
    const allTypesNames = await getAllTypesNames();
    const incorrectAnswers: string[] = [];
    while (incorrectAnswers.length < 3) {
        const randomType = allTypesNames[Math.floor(Math.random() * allTypesNames.length)];
        if (randomType !== moveType && !incorrectAnswers.includes(randomType)) {
            incorrectAnswers.push(randomType);
        }
    }

    const answers = [];
    //push the correct answer
    answers.push({
        isCorrect: true,
        answerText: thinkingEmojiList[0],
        answerImages: [await getTypeStprite(moveType)],
        answerAudios: []
    });
    //push the incorrect answers
    for (let i = 0; i < 3; i++) {
        answers.push({
            isCorrect: false,
            answerText: thinkingEmojiList[i + 1],
            answerImages: [await getTypeStprite(incorrectAnswers[i])],
            answerAudios: []
        });
    }
    shuffleArray(answers);

    //get all the pokemon that can learn this move
    const pokemonThatCanLearnMove = await getAllPokemonNamesThatCanLearnMove(moveName, maxPokedexIndex);
    const pokemonImages = await Promise.all(pokemonThatCanLearnMove.map(async pokemon => {
        return await getPokemonImageURL(pokemon.index);
    }));

    return {
        questionText: `¿Qué tipo es el movimiento ${capitalizeFirstLetter(moveName)}?`,
        questionImages: [],
        questionAudios: [],
        allowsMultipleAnswers: false,
        score: 1,
        onCorrectText: generateOnCorrectPrefix() + `El movimiento ${capitalizeFirstLetter(moveName)} es de tipo ${correctAnswer}.`,
        onCorrectImages: [await getTypeStprite(moveType)],
        onCorrectAudios: [],
        onIncorrectText: generateOnIncorrectMessage(correctAnswer),
        onIncorrectImages: [await getTypeStprite(moveType)],
        onIncorrectAudios: [],
        answers: answers
    }
}

const generateAllQuestions = async (maxPokedexIndex: number, numberOfQuestions: number): Promise<QUESTION[]> => {
    const questions = [];
    for (let i = 0; i < numberOfQuestions; i++) {
        const randomQuestionIndex = Math.floor(Math.random() * 11);
        switch (randomQuestionIndex) {

            case 0:
                console.log("0 Generating WhosThatPokemonQuestion");
                questions.push(await generateWhosThatPokemonQuestion(maxPokedexIndex));
                break;
            case 1:
                console.log("1 Generating WhoThisCryBelongsToQuestion");
                questions.push(await generateWhoThisCryBelongsToQuestion(maxPokedexIndex));
                break;
            case 2:
                console.log("2 Generating WhichOfTheseMovesDoesPokemonKnowQuestion");
                questions.push(await generateWhichOfTheseMovesDoesPokemonKnowQuestion(maxPokedexIndex));
                break;
            case 3:
                console.log("3 Generating WhichOfThesePokemonCanHaveAbilityQuestion");
                questions.push(await generateWhichOfThesePokemonCanHaveAbilityQuestion(maxPokedexIndex));
                break;
            case 4:
                console.log("4 Generating WhatDoesThisAbilityDoQuestion");
                questions.push(await whatDoesThisAbilityDoQuestion(maxPokedexIndex));
                break;
            case 5:
                console.log("5 Generating WhatsThePowerOfThisMoveQuestion");
                questions.push(await whatsThePowerOfThisMoveQuestion(maxPokedexIndex));
                break;
            case 6:
                console.log("6 Generating WhatsTheAccuracyOfThisMoveQuestion");
                questions.push(await whatsTheAccuracyOfThisMoveQuestion(maxPokedexIndex));
                break;
            case 7:
                console.log("7 Generating SelectTheCorrectCryForThisPokemonQuestion");
                questions.push(await generateSelectTheCorrectCryForThisPokemonQuestion(maxPokedexIndex));
                break;
            case 8:
                console.log("8 Generating WhatIsTheTargetOfThisMoveQuestion");
                questions.push(await generateWhatIsTheTargetOfThisMoveQuestion(maxPokedexIndex));
                break;
            case 9:
                console.log("9 Generating WhatsTheMultiplierDamageOfMoveTypeAgainsTypeCombination");
                questions.push(await whatsTheMultiplierDamageOfMoveTypeAgainsTypeCombination(maxPokedexIndex));
                break;
            case 10:
                console.log("10 Generating WhatTypeIsThisPokemonQuestion");
                questions.push(await generateWhatTypeIsThisPokemonQuestion(maxPokedexIndex));
                break;
            default:
                break;
        }
    }
    return questions;
}

const generateLureballLevelQuizz = async () => {
    const questions = [];
    questions.push(await whatsTheMultiplierDamageOfMoveTypeAgainsTypeCombination());
    return questions;
}

const generateNidoballLevelQuizz = async () => {
    const questions = [];
    questions.push(await generateWhosThatPokemonQuestion(1025));
    return questions;
}

const generatePokeballLevelQuizz = async () => {
    const questions = [];
    questions.push(await generateWhatTypeIsThisPokemonQuestion(1025));

    return questions;
}

const generateGreatballLevelQuizz = async () => {
    const questions = [];

    const mode = Math.floor(Math.random() * 2);

    switch (mode) {
        case 0:
            questions.push(await whatDoesThisAbilityDoQuestion(1025));

            break;
        case 1:
            questions.push(await generateWhichOfThesePokemonCanHaveAbilityQuestion(1025));
            break;
    }

    return questions;
}

const generateSafariballLevelQuizz = async () => {
    const questions = [];
    const mode = Math.floor(Math.random() * 2);

    switch (mode) {
        case 0:
            questions.push(await generateWhoThisCryBelongsToQuestion(1025));
            break;
        case 1:
            questions.push(await generateSelectTheCorrectCryForThisPokemonQuestion(1025));
            break;
    }
    return questions;
}

const generateSanaballLevelQuizz = async () => {
    const questions = [];
    questions.push(await generateWhichPokemonHasHighestBaseHPQuestion(1025));
    return questions;
}

const generateUltraballLevelQuizz = async () => {
    const questions = [];
    const mode = Math.floor(Math.random() * 6);
    switch (mode) {
        case 0:
            questions.push(await generateWhatDoesThisMoveDoQuestion(1025));
            break;
        case 1:
            questions.push(await generateWhatIsTheTargetOfThisMoveQuestion(1025));

            break;
        case 2:
            questions.push(await whatsTheAccuracyOfThisMoveQuestion(1025));
            break;
        case 3:
            questions.push(await generateWhatTypeIsThisMoveQuestion(1025));
            break;
        case 4:
            questions.push(await generateWhichOfTheseMovesDoesPokemonKnowQuestion(905));
            break;
        case 5:
            questions.push(await whatsThePowerOfThisMoveQuestion(1025));

            break;
    }
    return questions;
}

const generateParkballLevelQuizz = async () => {
    const questions = [];
    questions.push(await generateInWhichPalParkAreaCanYouFindThisPokemonQuestion(386));
    return questions;
}

const generateFriendballLevelQuizz = async () => {
    const questions = [];
    const mode = Math.floor(Math.random() * 2);
    switch (mode) {
        case 0:
            questions.push(await generateWhichPokemonHasHighestBaseDefenseQuestion(1025));
            break;
        case 1:
            questions.push(await hasThisPokemonHigherSpecialDefenseOrDefenseQuestion(1025));
            break;
    }
    return questions;
}

const generateLevelballQuizz = async () => {
    const questions: QUESTION[] = [];
    const mode = Math.floor(Math.random() * 2);

    switch (mode) {
        case 0:
            questions.push(await generateWhichPokemonHasHighestBaseAttackQuestion(1025));
            break;
        case 1:
            questions.push(await generateHasThisPokemonHigherAttackOrSpecialAttackQuestion(1025));
            break;
    }
    return questions;
}


const generateMasterballLevelQuizz = async () => {
    //all modes
    const questions = [];
    const mode = Math.floor(Math.random() * 15);
    switch (mode) {
        case 0:
            questions.push(await generateWhosThatPokemonQuestion(1025));
            break;
        case 1:
            questions.push(await generateWhatTypeIsThisPokemonQuestion(1025));
            break;
        case 2:
            questions.push(await whatDoesThisAbilityDoQuestion(1025));
            break;
        case 3:
            questions.push(await whatsThePowerOfThisMoveQuestion(1025));
            break;
        case 4:
            questions.push(await generateWhatIsTheTargetOfThisMoveQuestion(1025));
            break;
        case 5:
            questions.push(await generateWhoThisCryBelongsToQuestion(1025));
            break;
        case 6:
            questions.push(await whatsTheAccuracyOfThisMoveQuestion(1025));
            break;
        case 7:
            questions.push(await generateSelectTheCorrectCryForThisPokemonQuestion(1025));
            break;
        case 8:
            questions.push(await whatsTheMultiplierDamageOfMoveTypeAgainsTypeCombination());
            break;
        case 9:
            questions.push(await generateWhichOfTheseMovesDoesPokemonKnowQuestion(1025));
            break;
        case 10:
            questions.push(await generateWhichOfThesePokemonCanHaveAbilityQuestion(1025));
            break;
        case 11:
            questions.push(await whatDoesThisAbilityDoQuestion(1025));
            break;
        case 12:
            questions.push(await generateWhatTypeIsThisMoveQuestion(1025));
            break;
        case 13:
            questions.push(await generateWhatDoesThisMoveDoQuestion(1025));
            break;
        case 14:
            questions.push(await generateWhichOfThesePokemonIsTheFastestOneQuestion(1025));
            break;
    }
    return questions;
}

const generateQuickballLevelQuizz = async (maxPokedexIndex: number) => {
    const questions = [];

    questions.push(await generateWhichOfThesePokemonIsTheFastestOneQuestion(maxPokedexIndex));

    return questions;
}

const generateLoveballLevelQuizz = async () => {
    const questions = [];
    questions.push(await generateHasThisPokemonGenderDifferenceQuestion(1025));

    return questions;
}
const generateDuskballLevelQuizz = async () => {
    const questions = [];
    questions.push(await generateWhosThatPokemonQuestion(1025));
    return questions;
}
const generateHeavyballLevelQuizz = async () => {
    const questions = [];
    const mode = Math.floor(Math.random() * 2);
    switch (mode) {
        case 0:
            questions.push(await generateHowMuchDoesThisPokemonWeighQuestion(1025));
            break;
        case 1:
            questions.push(await generateHowTallIsThisPokemonQuestion(1025));
            break;
    }
    return questions;
}
const generateQuizz = async (difficulty: string) => {
    switch (difficulty) {
        case "lureball":
            return await generateLureballLevelQuizz();
        case "heavyball":
            return await generateHeavyballLevelQuizz();
        case "quickball":
            return await generateQuickballLevelQuizz(1025);
        case "loveball":
            return await generateLoveballLevelQuizz();
        case "duskball":
            return await generateDuskballLevelQuizz();
        case "sanaball":
            return await generateSanaballLevelQuizz();
        case "safariball":
            return await generateSafariballLevelQuizz();
        case "nidoball":
            return await generateNidoballLevelQuizz();
        case "pokeball":
            return await generatePokeballLevelQuizz();
        case "greatball":
            return await generateGreatballLevelQuizz();
        case "ultraball":
            return await generateUltraballLevelQuizz();
        case "masterball":
            return await generateMasterballLevelQuizz();
        case "friendball":
            return await generateFriendballLevelQuizz();
        case "levelball":
            return await generateLevelballQuizz();
        case "parkball":
            return await generateParkballLevelQuizz();
        default:
            return await generateNidoballLevelQuizz();
    }


}

const addParkballLevelQuestionToQuizz = async (quizz: QUESTION[]): Promise<QUESTION[]> => {
    const question = await generateParkballLevelQuizz();
    quizz.push(...question);
    return quizz;
}

const addLureballLevelQuestionToQuizz = async (quizz: QUESTION[]): Promise<QUESTION[]> => {
    const question = await generateLureballLevelQuizz();
    quizz.push(...question);
    return quizz;
}

const addHeavyballLevelQuestionToQuizz = async (quizz: QUESTION[]): Promise<QUESTION[]> => {
    const question = await generateHeavyballLevelQuizz();
    quizz.push(...question);
    return quizz;
}

const addNidoballLevelQuestionToQuizz = async (quizz: QUESTION[]): Promise<QUESTION[]> => {
    const question = await generateNidoballLevelQuizz();
    quizz.push(...question);
    return quizz;
}

const addPokeballLevelQuestionToQuizz = async (quizz: QUESTION[]): Promise<QUESTION[]> => {
    const question = await generatePokeballLevelQuizz();
    quizz.push(...question);
    return quizz;
}

const addDuskballLevelQuestionToQuizz = async (quizz: QUESTION[]): Promise<QUESTION[]> => {
    const question = await generateDuskballLevelQuizz();
    quizz.push(...question);
    return quizz;
}

const addGreatballLevelQuestionToQuizz = async (quizz: QUESTION[]): Promise<QUESTION[]> => {
    const question = await generateGreatballLevelQuizz();
    quizz.push(...question);
    return quizz;
}

const addUltraballLevelQuestionToQuizz = async (quizz: QUESTION[]): Promise<QUESTION[]> => {
    const question = await generateUltraballLevelQuizz();
    quizz.push(...question);
    return quizz;
}

const addSafariballLevelQuestionToQuizz = async (quizz: QUESTION[]): Promise<QUESTION[]> => {
    const question = await generateSafariballLevelQuizz();
    quizz.push(...question);
    return quizz;
}

const addSanaballLevelQuestionToQuizz = async (quizz: QUESTION[]): Promise<QUESTION[]> => {
    const question = await generateSanaballLevelQuizz();
    quizz.push(...question);
    return quizz;
}
const addQuickballLevelQuestionToQuizz = async (quizz: QUESTION[]): Promise<QUESTION[]> => {
    const question = await generateQuickballLevelQuizz(1025);
    quizz.push(...question);
    return quizz;
}

const addMasterballLevelQuestionToQuizz = async (quizz: QUESTION[]): Promise<QUESTION[]> => {
    const question = await generateMasterballLevelQuizz();
    quizz.push(...question);
    return quizz;
}

const addLoveballLevelQuestionToQuizz = async (quizz: QUESTION[]): Promise<QUESTION[]> => {
    const question = await generateLoveballLevelQuizz();
    quizz.push(...question);
    return quizz;
}

const addFriendballLevelQuestionToQuizz = async (quizz: QUESTION[]): Promise<QUESTION[]> => {
    const question = await generateFriendballLevelQuizz();
    quizz.push(...question);
    return quizz;
}

const addLevelballQuestionToQuizz = async (quizz: QUESTION[]): Promise<QUESTION[]> => {
    const question = await generateLevelballQuizz();
    quizz.push(...question);
    return quizz;
}

export { addParkballLevelQuestionToQuizz, addFriendballLevelQuestionToQuizz, addLevelballQuestionToQuizz, addLureballLevelQuestionToQuizz, addHeavyballLevelQuestionToQuizz, addDuskballLevelQuestionToQuizz, addLoveballLevelQuestionToQuizz, addMasterballLevelQuestionToQuizz, addQuickballLevelQuestionToQuizz, addSanaballLevelQuestionToQuizz, addSafariballLevelQuestionToQuizz, addUltraballLevelQuestionToQuizz, addGreatballLevelQuestionToQuizz, addPokeballLevelQuestionToQuizz, addNidoballLevelQuestionToQuizz, generateQuizz, generateWhatIsTheTargetOfThisMoveQuestion, generateAllQuestions, whatsThePowerOfThisMoveQuestion, generateWhosThatPokemonQuestion, generateWhoThisCryBelongsToQuestion, generateWhichOfTheseMovesDoesPokemonKnowQuestion, generateWhichOfThesePokemonCanHaveAbilityQuestion, whatDoesThisAbilityDoQuestion };