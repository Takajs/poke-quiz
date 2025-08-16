const generateNDifferentRandomNumbers = (n: number, min: number, max: number): number[] => {
    const numbers : number[] = []
    while (numbers.length < n) {
        const number = Math.floor(Math.random() * (max - min + 1) + min)
        if (!numbers.includes(number)) {
            numbers.push(number)
        }
    }
    return numbers
}

export { generateNDifferentRandomNumbers }