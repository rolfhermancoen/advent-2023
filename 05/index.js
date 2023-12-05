const fs = require("fs");
const Papa = require("papaparse");

const csvFilePath = "05/data.csv";

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

const getMap = (data, key) => {
  const startIndex = data.findIndex((d) => d[0] === key);
  const endIndex = data.findIndex(
    (d, index) => d[0] === "" && index > startIndex
  );

  const map = [];
  data.forEach((d, i) => {
    if (i > startIndex && i < endIndex) {
      const [destinationRangeStart, sourceRangeStart, rangeLength] =
        d[0].split(" ");
      map.push({
        destinationRangeStart: parseInt(destinationRangeStart),
        sourceRangeStart: parseInt(sourceRangeStart),
        rangeLength: parseInt(rangeLength),
      });
    }

    return;
  });

  return parseMap(map);
};

const getFromMap = (map, array) => {
  return array.map((item) => {
    const foundMap = map.find(
      (map) => map.sourceStart <= item && map.sourceEnd >= item
    );
    if (!foundMap) {
      return item;
    }
    const offset = item - foundMap.sourceStart;
    return foundMap.destinationStart + offset;
  });
};

const parseMap = (map) => {
  return map.map((d) => ({
    destinationStart: d.destinationRangeStart,
    destinationEnd: d.destinationRangeStart + d.rangeLength - 1,
    sourceStart: d.sourceRangeStart,
    sourceEnd: d.sourceRangeStart + d.rangeLength - 1,
  }));
};

const testOne = async () => {
  const parsedData = await readCSV(csvFilePath);

  const seeds = parsedData[0][0]
    .replace(/seeds\:/g, "")
    .split(" ")
    .filter((d) => d !== "")
    .map((d) => parseInt(d));

  const seedToSoilMap = getMap(parsedData, "seed-to-soil map:");
  const soils = getFromMap(seedToSoilMap, seeds);

  const soilToFertilizerMap = getMap(parsedData, "soil-to-fertilizer map:");
  const fertilizers = getFromMap(soilToFertilizerMap, soils);

  const fertilizerToWaterMap = getMap(parsedData, "fertilizer-to-water map:");
  const waters = getFromMap(fertilizerToWaterMap, fertilizers);

  const waterToLightMap = getMap(parsedData, "water-to-light map:");
  const lights = getFromMap(waterToLightMap, waters);

  const lightToTemperatureMap = getMap(parsedData, "light-to-temperature map:");
  const temperatures = getFromMap(lightToTemperatureMap, lights);

  const temperatureToHumidityMap = getMap(
    parsedData,
    "temperature-to-humidity map:"
  );
  const humidities = getFromMap(temperatureToHumidityMap, temperatures);

  const humidityToLocationMap = getMap(parsedData, "humidity-to-location map:");
  const locations = getFromMap(humidityToLocationMap, humidities);

  console.log("Result 1", Math.min(...locations));
};

testOne();

const testTwo = async () => {
  const parsedData = await readCSV(csvFilePath);
  const startSeeds = parsedData[0][0]
    .replace(/seeds\:/g, "")
    .split(" ")
    .filter((d) => d !== "")
    .map((d, i) => (i % 2 === 0 ? parseInt(d) : undefined))
    .filter((d) => d !== undefined);

  const rangeSeeds = parsedData[0][0]
    .replace(/seeds\:/g, "")
    .split(" ")
    .filter((d) => d !== "")
    .map((d, i) => (i % 2 !== 0 ? parseInt(d) : undefined))
    .filter((d) => d !== undefined);

  const seeds = startSeeds.map((startSeed, i) => {
    return [
      {
        start: startSeed,
        end: startSeed + rangeSeeds[i],
      },
    ];
  });

  const seedToSoilMap = getMap(parsedData, "seed-to-soil map:");
  const soilToFertilizerMap = getMap(parsedData, "soil-to-fertilizer map:");
  const fertilizerToWaterMap = getMap(parsedData, "fertilizer-to-water map:");
  const waterToLightMap = getMap(parsedData, "water-to-light map:");
  const lightToTemperatureMap = getMap(parsedData, "light-to-temperature map:");
  const temperatureToHumidityMap = getMap(
    parsedData,
    "temperature-to-humidity map:"
  );

  const humidityToLocationMap = getMap(parsedData, "humidity-to-location map:");

  let minLoc = undefined;
  let objInd = 0;
  for (seedObj of seeds) {
    console.log("new seedObj", seedObj);
    for (i = 0; i < seedObj[0].end - seedObj[0].start; i++) {
      if (i % 5000000 === 0) {
        console.log(
          `Processing seedObj ${objInd} of ${seeds.length}. Progress ->`,
          Math.round((i / (seedObj[0].end - seedObj[0].start)) * 100 * 100) /
            100,
          "%"
        );
      }
      const soils = getFromMap(seedToSoilMap, [seedObj[0].start + i]);

      const fertilizers = getFromMap(soilToFertilizerMap, soils);

      const waters = getFromMap(fertilizerToWaterMap, fertilizers);

      const lights = getFromMap(waterToLightMap, waters);

      const temperatures = getFromMap(lightToTemperatureMap, lights);

      const humidities = getFromMap(temperatureToHumidityMap, temperatures);

      const locations = getFromMap(humidityToLocationMap, humidities);

      if (!minLoc || locations[0] < minLoc) {
        minLoc = locations[0];
        console.log("Found new Minimum Value -> ", locations[0]);
      }
    }
    objInd++;
  }

  console.log("Minimum Value -> ", minLoc);
};

testTwo();
