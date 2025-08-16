const getAllMoves = async () => {
    const moves = await fetch('https://pokeapi.co/api/v2/move?limit=919');
    const movesJSON = await moves.json();
    return movesJSON.results;
}

const getAllMovesNames = async () => {
    const moves = await getAllMoves();
    let movesNames = [];
    for (let i = 0; i < moves.length; i++) {
        movesNames.push(moves[i].name);
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



    return movesNames;
}

const getMoveByName = async (moveName: string) => {
    moveName = moveName.replace(' ', '-');
    const move = await fetch(`https://pokeapi.co/api/v2/move/${moveName}`);
    return move.json();
}

const getMoveIndexByName = async (moveName: string) => {
    const move = await getMoveByName(moveName);
    return move.id;
}

const getNRandomDifferentMovesNamesAndIndexes = async (n: number) => {
    let moves = await getAllMoves();
    const movesAndIndexes: { move: string, index: number }[] = [];



    moves = moves.filter(move => !move.name.includes("Max-"));
    moves = moves.filter(move => !move.name.includes("Max "));
    moves = moves.filter(move => !move.name.includes("Black hole"));
    moves = moves.filter(move => !move.name.includes("10"));
    moves = moves.filter(move => !move.name.includes("eevee"));
    moves = moves.filter(move => !move.name.includes("pika"));
    moves = moves.filter(move => !move.name.includes("gigavolt"));
    moves = moves.filter(move => !move.name.includes("pancake"));
    moves = moves.filter(move => !move.name.includes("special"));
    moves = moves.filter(move => !move.name.includes("physical"));

    while (movesAndIndexes.length < n) {
        const randomIndex = Math.floor(Math.random() * moves.length);
        if (!movesAndIndexes.some(moveAndIndex => moveAndIndex.index === randomIndex)) {
            movesAndIndexes.push({ move: moves[randomIndex].name, index: getMoveIndexByName(moves[randomIndex].name) });
        }
    }
    return movesAndIndexes;
}

const getMoveType = async (moveName: string) => {
    const move = await getMoveByName(moveName);
    return move.type.name;
}

const getTargetOfMove = async (moveName: string) => {
    const move = await getMoveByName(moveName);
    return move.target.name;
}

const getTypeOfMove = async (moveName: string) => {
    const move = await getMoveByName(moveName);
    return move.type.name;
}
const getMoveDescriptionByName = async (moveName: string) => {
    const move = await getMoveByName(moveName);
    return move.flavor_text_entries.find(entry => entry.language.name === 'es')?.flavor_text || '';
}
export { getMoveDescriptionByName, getMoveType, getAllMoves, getAllMovesNames, getMoveByName, getMoveIndexByName, getNRandomDifferentMovesNamesAndIndexes, getTargetOfMove }