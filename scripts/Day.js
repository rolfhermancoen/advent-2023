const fs = require("fs");
const Papa = require("papaparse");

module.exports = class Day {
  day = undefined;
  delimiter = undefined;

  data = null;
  constructor(day, delimiter) {
    this.day = day;
    this.delimiter = delimiter;
    this.filePath = "data/" + day + ".csv";
    this.run();
  }

  readCSV = async () => {
    const csvFile = fs.readFileSync(this.filePath);
    const csvData = csvFile.toString();
    return new Promise((resolve) => {
      Papa.parse(csvData, {
        delimiter: this.delimiter,
        complete: (results) => {
          resolve(results.data);
        },
      });
    });
  };

  async run() {
    const resultOne = await this.partOne();
    console.log(`Result Part 1:`, resultOne);
    const resultTwo = await this.partTwo();
    console.log(`Result Part 2:`, resultTwo);
  }

  async getData() {
    return this.readCSV();
  }

  async partOne() {
    throw new Error("Method 'partOne()' must be implemented.");
  }

  async partTwo() {
    throw new Error("Method 'partTwo()' must be implemented.");
  }
};
