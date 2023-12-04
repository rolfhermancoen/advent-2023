const fs = require("fs");
const Papa = require("papaparse");

const csvFilePath = "03/data.csv";

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

const testOne = async () => {
  const parsedData = await readCSV(csvFilePath);
  const gridData = parsedData.map((dat) => dat[0].split(""));

  const foundDigits = [];

  gridData.forEach((dat, y) =>
    dat.forEach((d, x) => {
      if (d === ".") {
        return;
      }

      if (!isNaN(d)) {
        foundDigits.push({ x, y });
      }

      return;
    })
  );

  const foundCodes = [];

  for (digit of foundDigits) {
    const codeIndex = foundCodes.findIndex((code) =>
      code.some((cords) => cords.y === digit.y && cords.x + 1 === digit.x)
    );
    if (codeIndex !== -1) {
      foundCodes[codeIndex] = [...foundCodes[codeIndex], digit];
    } else {
      foundCodes.push([digit]);
    }
  }

  const validCodes = [];

  for (code of foundCodes) {
    for (digit of code) {
      const search = [-1, 0, 1];
      for (x of search) {
        for (y of search) {
          if (digit.y + y < 0 || digit.x + x < 0) {
            continue;
          }
          if (
            digit.y + y > gridData.length - 1 ||
            digit.x + x > gridData[0].length - 1
          ) {
            continue;
          }

          const value =
            gridData[parseInt(digit.y) + parseInt(y)][
              parseInt(digit.x) + parseInt(x)
            ];

          if (
            isNaN(value) &&
            value !== "." &&
            validCodes[validCodes.length - 1] !== code
          ) {
            validCodes.push(code);
            break;
          }
        }
      }
    }
  }

  const stringCodes = validCodes.map((code) =>
    code.reduce((prev, cur) => prev + gridData[cur.y][cur.x], "")
  );

  const answer = stringCodes.reduce(
    (prev, cur) => parseInt(prev) + parseInt(cur),
    0
  );

  console.log("Result 1", answer, stringCodes.length);
};

testOne();

const testTwo = async () => {
  const parsedData = await readCSV(csvFilePath);
  const gridData = parsedData.map((dat) => dat[0].split(""));

  const foundDigits = [];

  gridData.forEach((dat, y) =>
    dat.forEach((d, x) => {
      if (d === ".") {
        return;
      }

      if (!isNaN(d)) {
        foundDigits.push({ x, y });
      }

      return;
    })
  );

  const foundCodes = [];

  for (digit of foundDigits) {
    const codeIndex = foundCodes.findIndex((code) =>
      code.some((cords) => cords.y === digit.y && cords.x + 1 === digit.x)
    );
    if (codeIndex !== -1) {
      foundCodes[codeIndex] = [...foundCodes[codeIndex], digit];
    } else {
      foundCodes.push([digit]);
    }
  }

  const validCodes = [];
  const multipliers = [];

  for (code of foundCodes) {
    for (digit of code) {
      const search = [-1, 0, 1];
      for (x of search) {
        for (y of search) {
          if (digit.y + y < 0 || digit.x + x < 0) {
            continue;
          }
          if (
            digit.y + y > gridData.length - 1 ||
            digit.x + x > gridData[0].length - 1
          ) {
            continue;
          }

          const value =
            gridData[parseInt(digit.y) + parseInt(y)][
              parseInt(digit.x) + parseInt(x)
            ];

          if (value === "*" && validCodes[validCodes.length - 1] !== code) {
            validCodes.push(code);
            if (
              !multipliers.some(
                (mult) =>
                  mult.x === parseInt(digit.x) + parseInt(x) &&
                  mult.y === parseInt(digit.y) + parseInt(y)
              )
            ) {
              multipliers.push({
                x: parseInt(digit.x) + parseInt(x),
                y: parseInt(digit.y) + parseInt(y),
              });
            }

            break;
          }
        }
      }
    }
  }

  const foundMultiplierCodes = [];
  const multiplierCodes = [];

  for (multiplier of multipliers) {
    const search = [-1, 0, 1];
    for (x of search) {
      for (y of search) {
        if (multiplier.y + y < 0 || multiplier.x + x < 0) {
          continue;
        }
        if (
          multiplier.y + y > gridData.length - 1 ||
          multiplier.x + x > gridData[0].length - 1
        ) {
          continue;
        }

        const value =
          gridData[parseInt(multiplier.y) + parseInt(y)][
            parseInt(multiplier.x) + parseInt(x)
          ];

        if (!isNaN(value)) {
          const code = validCodes.find((code) =>
            code.some(
              (digit) =>
                digit.x === parseInt(multiplier.x) + parseInt(x) &&
                digit.y === parseInt(multiplier.y) + parseInt(y)
            )
          );

          if (
            foundMultiplierCodes.some((co) =>
              co.some((c) => c.x === code[0].x && c.y === code[0].y)
            )
          ) {
            continue;
          }
          foundMultiplierCodes.push(code);

          multiplierCodes.push({
            code,
            multiplier,
          });
          continue;
        }
      }
    }
  }

  const correctMultiplierCodes = [];

  for (multiplierCode of multiplierCodes) {
    if (
      correctMultiplierCodes.some(
        (muCode) =>
          muCode.multiplier.x === multiplierCode.multiplier.x &&
          muCode.multiplier.y === multiplierCode.multiplier.y
      )
    ) {
      continue;
    }

    const foundCodes = multiplierCodes.filter(
      (muCode) =>
        multiplierCode.multiplier.x === muCode.multiplier.x &&
        multiplierCode.multiplier.y === muCode.multiplier.y
    );

    if (foundCodes.length === 2) {
      correctMultiplierCodes.push({
        multiplier: multiplierCode.multiplier,
        codeOne: foundCodes[0].code,
        codeTwo: foundCodes[1].code,
      });
      continue;
    }
  }

  const stringCodes = correctMultiplierCodes.map((multiCode) => ({
    multiplier: multiCode.multiplier,
    answer:
      multiCode.codeOne.reduce(
        (prev, cur) => prev + gridData[cur.y][cur.x],
        ""
      ) *
      multiCode.codeTwo.reduce(
        (prev, cur) => prev + gridData[cur.y][cur.x],
        ""
      ),
  }));

  const answer = stringCodes.reduce((prev, cur) => prev + cur.answer, 0);

  console.log("Result 2", answer);
};

testTwo();
