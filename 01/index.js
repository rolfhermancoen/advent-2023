const fs = require("fs");
const Papa = require("papaparse");

const csvFilePath = "01/data.csv";

const readCSV = async (filePath) => {
  const csvFile = fs.readFileSync(filePath);
  const csvData = csvFile.toString();
  return new Promise((resolve) => {
    Papa.parse(csvData, {
      complete: (results) => {
        resolve(results.data);
      },
    });
  });
};

const testOne = async () => {
  const parsedData = await readCSV(csvFilePath);
  const mappedData = parsedData.map((data) => data[0].replace(/\D/g, ""));
  const twoDigitsData = mappedData.map((data) =>
    parseInt(data[0] + data[data.length - 1])
  );
  const result = twoDigitsData.reduce((prev, cur) => prev + cur, 0);
  console.log("Result 1", result);
};

testOne();

const chars = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

const testTwo = async () => {
  const parsedData = await readCSV(csvFilePath);
  const regex = /(?=(one|two|three|four|five|six|seven|eight|nine|[1-9]))/g;
  const mappedData = parsedData.map((data, index) => {
    const found = Array.from(data[0].matchAll(regex), x => x[1]).join('')

    return found.replace(
      /one|two|three|four|five|six|seven|eight|nine/g,
      (m) => chars[m]
    );
  });

  const twoDigitsData = mappedData.map((data) =>
    parseInt(data[0] + data[data.length - 1])
  );
  const result = twoDigitsData.reduce((prev, cur) => prev + cur, 0);
  console.log("Result 2", result);

};

testTwo();
