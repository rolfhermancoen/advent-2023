const Day = require("./Day");

class DayFive extends Day {
  constructor() {
    super("05");
  }

  async partOne() {
    const parsedData = await this.getData();

    const seeds = parsedData[0][0]
      .replace(/seeds\:/g, "")
      .split(" ")
      .filter((d) => d !== "")
      .map((d) => parseInt(d));

    const seedToSoilMap = this.getMap(parsedData, "seed-to-soil map:");
    const soils = this.getFromMap(seedToSoilMap, seeds);
    const soilToFertilizerMap = this.getMap(
      parsedData,
      "soil-to-fertilizer map:"
    );
    const fertilizers = this.getFromMap(soilToFertilizerMap, soils);
    const fertilizerToWaterMap = this.getMap(
      parsedData,
      "fertilizer-to-water map:"
    );
    const waters = this.getFromMap(fertilizerToWaterMap, fertilizers);
    const waterToLightMap = this.getMap(parsedData, "water-to-light map:");
    const lights = this.getFromMap(waterToLightMap, waters);
    const lightToTemperatureMap = this.getMap(
      parsedData,
      "light-to-temperature map:"
    );
    const temperatures = this.getFromMap(lightToTemperatureMap, lights);
    const temperatureToHumidityMap = this.getMap(
      parsedData,
      "temperature-to-humidity map:"
    );
    const humidities = this.getFromMap(temperatureToHumidityMap, temperatures);
    const humidityToLocationMap = this.getMap(
      parsedData,
      "humidity-to-location map:"
    );
    const locations = this.getFromMap(humidityToLocationMap, humidities);

    return Math.min(...locations);
  }

  async partTwo() {
    const parsedData = await this.getData();
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

    const seedToSoilMap = this.getMap(parsedData, "seed-to-soil map:");
    const soilToFertilizerMap = this.getMap(
      parsedData,
      "soil-to-fertilizer map:"
    );
    const fertilizerToWaterMap = this.getMap(
      parsedData,
      "fertilizer-to-water map:"
    );
    const waterToLightMap = this.getMap(parsedData, "water-to-light map:");
    const lightToTemperatureMap = this.getMap(
      parsedData,
      "light-to-temperature map:"
    );
    const temperatureToHumidityMap = this.getMap(
      parsedData,
      "temperature-to-humidity map:"
    );
    const humidityToLocationMap = this.getMap(
      parsedData,
      "humidity-to-location map:"
    );

    let minLoc = undefined;
    let objInd = 0;

    for (let i = 0; i < seeds.length; i++) {
      const seedObj = seeds[i];
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
        const soils = this.getFromMap(seedToSoilMap, [seedObj[0].start + i]);
        const fertilizers = this.getFromMap(soilToFertilizerMap, soils);
        const waters = this.getFromMap(fertilizerToWaterMap, fertilizers);
        const lights = this.getFromMap(waterToLightMap, waters);
        const temperatures = this.getFromMap(lightToTemperatureMap, lights);
        const humidities = this.getFromMap(
          temperatureToHumidityMap,
          temperatures
        );
        const locations = this.getFromMap(humidityToLocationMap, humidities);

        if (!minLoc || locations[0] < minLoc) {
          minLoc = locations[0];
          console.log("Found new Minimum Value -> ", locations[0]);
        }
      }
      objInd++;
    }

    return minLoc;
  }

  getMap(data, key) {
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

    return this.parseMap(map);
  }

  getFromMap(map, array) {
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
  }

  parseMap(map) {
    return map.map((d) => ({
      destinationStart: d.destinationRangeStart,
      destinationEnd: d.destinationRangeStart + d.rangeLength - 1,
      sourceStart: d.sourceRangeStart,
      sourceEnd: d.sourceRangeStart + d.rangeLength - 1,
    }));
  }
}

new DayFive();
