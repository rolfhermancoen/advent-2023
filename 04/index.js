const fs = require("fs");
const Papa = require("papaparse");

const csvFilePath = "04/data.csv";

const readCSV = async (filePath) => {
  const csvFile = fs.readFileSync(filePath);
  const csvData = csvFile.toString();
  return new Promise((resolve) => {
    Papa.parse(csvData, {
      delimiter: "|",
      complete: (results) => {
        resolve(results.data);
      },
    });
  });
};

const testOne = async () => {
  const parsedData = await readCSV(csvFilePath);

  const mappedData = parsedData.map((dat) => {
    return {
      winning: dat[0]
        .replace(/Card\s+[0-9]{1,3}:/g, "")
        .split(" ")
        .filter((d) => d !== ""),
      numbers: dat[1].split(" ").filter((d) => d !== ""),
    };
  });

  const winningNumbersPerCard = mappedData.map((card) => {
    const winningNumbers = [];
    for (number of card.numbers) {
      if (card.winning.some((num) => num === number)) {
        winningNumbers.push(number);
        continue;
      }
    }
    return winningNumbers;
  });

  const pointsPerCard = winningNumbersPerCard.map((card) => {
    if (card.length === 0) {
      return 0;
    }

    if (card.length === 1) {
      return 1;
    }

    return Math.pow(2, card.length - 1);
  });

  const result = pointsPerCard.reduce((prev, cur) => prev + cur, 0);

  console.log("Result 1", result);
};

testOne();

const testTwo = async () => {
  const parsedData = await readCSV(csvFilePath);

  const mappedData = parsedData.map((dat) => {
    return {
      winning: dat[0]
        .replace(/Card\s+[0-9]{1,3}:/g, "")
        .split(" ")
        .filter((d) => d !== ""),
      numbers: dat[1].split(" ").filter((d) => d !== ""),
    };
  });

  const winningNumbersPerCard = mappedData.map((card) => {
    const winningNumbers = [];
    for (number of card.numbers) {
      if (card.winning.some((num) => num === number)) {
        winningNumbers.push(number);
        continue;
      }
    }
    return winningNumbers.length;
  });

  const totalCards = Array.from(Array(winningNumbersPerCard.length)).map(
    () => 1
  );

  for (let i = 0; i < winningNumbersPerCard.length; i++) {
    const count = totalCards[i];

    const wins = winningNumbersPerCard[i];

    if (wins === 0) {
      continue;
    }

    for (let j = 0; j < wins; j++) {
      const previousCount = totalCards[i + j + 1];
      if (i + j + 1 < winningNumbersPerCard.length) {
        totalCards[i + j + 1] = previousCount + count;
      }
    }
  }

  const result = totalCards.reduce((prev, cur) => prev + cur, 0);

  console.log("Result 2", result);
};

testTwo();
