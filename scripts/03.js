const Day = require("./Day");

class DayThree extends Day {
  constructor() {
    super("03");
  }

  async partOne() {
    const parsedData = await this.getData();
    const gridData = parsedData.map((dat) => dat[0].split(""));

    const foundDigits = this.findDigits(gridData);

    const foundCodes = this.findCodes(foundDigits);

    const validCodes = [];

    for (let i = 0; i < foundCodes.length; i++) {
      const code = foundCodes[i];

      for (let j = 0; j < code.length; j++) {
        const digit = code[j];
        const search = [-1, 0, 1];

        for (let k = 0; k < search.length; k++) {
          const x = search[k];

          for (let l = 0; l < search.length; l++) {
            const y = search[l];
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

    return stringCodes.reduce((prev, cur) => parseInt(prev) + parseInt(cur), 0);
  }

  async partTwo() {
    const parsedData = await this.getData();
    const gridData = parsedData.map((dat) => dat[0].split(""));

    const digits = this.findDigits(gridData);
    const codes = this.findCodes(digits);

    const validCodes = [];
    const multipliers = [];

    for (let i = 0; i < codes.length; i++) {
      const code = codes[i];

      for (let j = 0; j < code.length; j++) {
        const digit = code[j];
        const search = [-1, 0, 1];

        for (let k = 0; k < search.length; k++) {
          const x = search[k];

          for (let l = 0; l < search.length; l++) {
            const y = search[l];

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

    for (let i = 0; i < multipliers.length; i++) {
      const multiplier = multipliers[i];
      const search = [-1, 0, 1];

      for (let j = 0; j < search.length; j++) {
        const x = search[j];

        for (let k = 0; k < search.length; k++) {
          const y = search[k];
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

    for (let i = 0; i < multiplierCodes.length; i++) {
      const multiplierCode = multiplierCodes[i];

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

    return stringCodes.reduce((prev, cur) => prev + cur.answer, 0);
  }

  findDigits(gridData) {
    const digits = [];

    gridData.forEach((dat, y) =>
      dat.forEach((d, x) => {
        if (d === ".") {
          return;
        }

        if (!isNaN(d)) {
          digits.push({ x, y });
        }

        return;
      })
    );

    return digits;
  }

  findCodes(foundDigits) {
    const codes = [];

    for (let i = 0; i < foundDigits.length; i++) {
      const digit = foundDigits[i];
      const codeIndex = codes.findIndex((code) =>
        code.some((cords) => cords.y === digit.y && cords.x + 1 === digit.x)
      );

      if (codeIndex !== -1) {
        codes[codeIndex] = [...codes[codeIndex], digit];
      } else {
        codes.push([digit]);
      }
    }
    return codes;
  }
}

new DayThree();
