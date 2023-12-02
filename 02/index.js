const fs = require("fs");
const Papa = require("papaparse");

const csvFilePath = "02/data.csv";

const readCSV = async (filePath) => {
  const csvFile = fs.readFileSync(filePath);
  const csvData = csvFile.toString();
  return new Promise((resolve) => {
    Papa.parse(csvData, {
      delimiter: ";",
      complete: (results) => {
        resolve(results.data);
      },
    });
  });
};

const getColorValue = (string, color) => {
  const splittedString = string.split(",");
  let colorString = splittedString.find((str) => str.includes(color));

  if (colorString) {
    if (colorString.includes("Game")) {
      colorString = colorString.replace(/Game [0-9]{1,3}:/g, "");
    }
    colorString = colorString.replace(color, "");

    return parseInt(colorString);
  }
  return undefined;
};
const MAX_BLUE = 14;
const MAX_RED = 12;
const MAX_GREEN = 13;

const testOne = async () => {
  const parsedData = await readCSV(csvFilePath);
  const mappedData = parsedData.map((dat) => {
    const mappedGames = dat.map((d) => ({
      ...(getColorValue(d, "blue") ? { blue: getColorValue(d, "blue") } : {}),
      ...(getColorValue(d, "red") ? { red: getColorValue(d, "red") } : {}),
      ...(getColorValue(d, "green")
        ? { green: getColorValue(d, "green") }
        : {}),
    }));
    return mappedGames;
  });

  const possibleGames = [];

  mappedData.forEach((game, index) => {
    let impossibleSet = null;
    for (set of game) {
      if (set.red && set.red > MAX_RED) {
        impossibleSet = set;
        break;
      }
      if (set.blue && set.blue > MAX_BLUE) {
        impossibleSet = set;
        break;
      }
      if (set.green && set.green > MAX_GREEN) {
        impossibleSet = set;
        break;
      }
    }

    if (!impossibleSet) {
      possibleGames.push(index + 1);
    }
  });

  const answer = possibleGames.reduce((prev, cur) => prev + cur, 0);

  console.log("Result 1", answer);
};

testOne();

const testTwo = async () => {
  const parsedData = await readCSV(csvFilePath);
  const mappedData = parsedData.map((dat) => {
    const mappedGames = dat.map((d) => ({
      ...(getColorValue(d, "blue") ? { blue: getColorValue(d, "blue") } : {}),
      ...(getColorValue(d, "red") ? { red: getColorValue(d, "red") } : {}),
      ...(getColorValue(d, "green")
        ? { green: getColorValue(d, "green") }
        : {}),
    }));
    return mappedGames;
  });

  const powerArray = mappedData.map((game) => {
    let minRed = 0;
    let minBlue = 0;
    let minGreen = 0;

    for (set of game) {
      if (set.red && set.red > minRed) {
        minRed = set.red;
      }
      if (set.blue && set.blue > minBlue) {
        minBlue = set.blue;
      }
      if (set.green && set.green > minGreen) {
        minGreen = set.green;
      }
      continue;
    }

    return minRed * minBlue * minGreen;
  });

  const answer = powerArray.reduce((prev, cur) => prev + cur, 0);

  console.log("Result 2", answer);
};
testTwo();
