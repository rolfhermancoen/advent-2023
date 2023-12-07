const Day = require("./Day");

class DaySeven extends Day {
  handTypes = {
    fiveOfAKind: 7,
    fourOfAKind: 6,
    fullHouse: 5,
    threeOfAKind: 4,
    twoPair: 3,
    onePair: 2,
    highCard: 1,
  };

  cardTypesPartOne = {
    A: 13,
    K: 12,
    Q: 11,
    J: 10,
    T: 9,
    9: 8,
    8: 7,
    7: 6,
    6: 5,
    5: 4,
    4: 3,
    3: 2,
    2: 1,
  };

  cardTypesPartTwo = {
    A: 13,
    K: 12,
    Q: 11,
    T: 10,
    9: 9,
    8: 8,
    7: 7,
    6: 6,
    5: 5,
    4: 4,
    3: 3,
    2: 2,
    J: 1,
  };

  constructor() {
    super("07", " ");
  }

  async partOne() {
    const data = await this.getData();

    const handTypeData = data.map((d) => ({
      hand: d[0],
      bet: parseInt(d[1]),
      type: this.getHandTypePartOne(d[0]),
    }));

    const rankedHands = handTypeData.sort((x, y) => {
      if (x.type !== y.type) {
        if (x.type > y.type) {
          return -1;
        }

        if (x.type < y.type) {
          return 1;
        }
      }

      const highestHand = this.getHighestHand(x.hand, y.hand, 1);

      if (highestHand) {
        if (highestHand === x.hand) {
          return -1;
        } else if (highestHand === y.hand) {
          return 1;
        }
      }

      return 0;
    });

    const mappedBets = rankedHands.reverse().map((d, index) => {
      const rank = index + 1;
      return {
        ...d,
        winnings: d.bet * rank,
      };
    });

    return mappedBets.reduce((prev, cur) => prev + cur.winnings, 0);
  }

  async partTwo() {
    const data = await this.getData();

    const handTypeData = data.map((d) => ({
      hand: d[0],
      bet: parseInt(d[1]),
      type: this.getHandTypePartTwo(d[0]),
    }));

    const rankedHands = handTypeData.sort((x, y) => {
      if (x.type !== y.type) {
        if (x.type > y.type) {
          return -1;
        }

        if (x.type < y.type) {
          return 1;
        }
      }

      const highestHand = this.getHighestHand(x.hand, y.hand, 2);

      if (highestHand) {
        if (highestHand === x.hand) {
          return -1;
        } else if (highestHand === y.hand) {
          return 1;
        }
      }

      return 0;
    });

    const mappedBets = rankedHands.reverse().map((d, index) => {
      const rank = index + 1;
      return {
        ...d,
        winnings: d.bet * rank,
      };
    });

    return mappedBets.reduce((prev, cur) => prev + cur.winnings, 0);
  }

  getHandTypePartOne(cardString) {
    const cards = cardString.split("");

    const cardObject = {};

    for (let i = 0; i < cards.length; i++) {
      if (Object.keys(cardObject).some((key) => key === cards[i])) {
        cardObject[cards[i]] = cardObject[cards[i]] + 1;
      } else {
        cardObject[cards[i]] = 1;
      }
    }

    let handType = this.handTypes.highCard;
    Object.keys(cardObject).forEach((key) => {
      const value = cardObject[key];

      if (value === 5) {
        handType = this.handTypes.fiveOfAKind;
        return;
      }

      if (value === 4) {
        handType = this.handTypes.fourOfAKind;
        return;
      }

      if (value === 3) {
        if (handType === this.handTypes.onePair) {
          handType = this.handTypes.fullHouse;
        } else {
          handType = this.handTypes.threeOfAKind;
        }
        return;
      }

      if (value === 2) {
        if (handType === this.handTypes.threeOfAKind) {
          handType = this.handTypes.fullHouse;
        } else if (handType === this.handTypes.onePair) {
          handType = this.handTypes.twoPair;
        } else {
          handType = this.handTypes.onePair;
        }
        return;
      }
    });
    return handType;
  }

  getHandTypePartTwo(cardString) {
    if (!cardString.includes("J")) {
      return this.getHandTypePartOne(cardString);
    }

    const cards = cardString.split("");

    const cardObject = {};

    for (let i = 0; i < cards.length; i++) {
      if (Object.keys(cardObject).some((key) => key === cards[i])) {
        cardObject[cards[i]] = cardObject[cards[i]] + 1;
      } else {
        cardObject[cards[i]] = 1;
      }
    }

    let handType = this.handTypes.highCard;
    Object.keys(cardObject).forEach((key) => {
      const value = cardObject[key];
      if (key === "J" && value !== 5) {
        return;
      }

      const jokersValue = cardObject["J"];

      if (value === 5) {
        handType = this.handTypes.fiveOfAKind;
        return;
      }

      if (value === 4) {
        if (jokersValue === 1) {
          handType = this.handTypes.fiveOfAKind;
          return;
        }
        handType = this.handTypes.fourOfAKind;
        return;
      }

      if (value === 3) {
        if (jokersValue === 2) {
          handType = this.handTypes.fiveOfAKind;
          return;
        }
        if (jokersValue === 1) {
          handType = this.handTypes.fourOfAKind;
          return;
        }

        if (handType === this.handTypes.onePair) {
          handType = this.handTypes.fullHouse;
        } else {
          handType = this.handTypes.threeOfAKind;
        }
        return;
      }

      if (value === 2) {
        if (jokersValue === 3) {
          handType = this.handTypes.fiveOfAKind;
          return;
        }
        if (jokersValue === 2) {
          handType = this.handTypes.fourOfAKind;
          return;
        }

        if (jokersValue === 1 && handType !== this.handTypes.threeOfAKind) {
          handType = this.handTypes.threeOfAKind;
          return;
        }

        if (handType === this.handTypes.threeOfAKind) {
          handType = this.handTypes.fullHouse;
        } else if (handType === this.handTypes.onePair) {
          handType = this.handTypes.twoPair;
        } else {
          handType = this.handTypes.onePair;
        }
        return;
      }

      if ((handType === this.handTypes.highCard) & (jokersValue === 1)) {
        handType = this.handTypes.onePair;
        return;
      }

      if ((handType === this.handTypes.highCard) & (jokersValue === 2)) {
        handType = this.handTypes.threeOfAKind;
        return;
      }

      if ((handType === this.handTypes.highCard) & (jokersValue === 3)) {
        handType = this.handTypes.fourOfAKind;
        return;
      }

      if ((handType === this.handTypes.highCard) & (jokersValue === 4)) {
        handType = this.handTypes.fiveOfAKind;
        return;
      }
    });
    return handType;
  }

  getCardTypePartOne(card) {
    return this.cardTypesPartOne[card];
  }

  getCardTypePartTwo(card) {
    return this.cardTypesPartTwo[card];
  }

  getHighestHand(x, y, part) {
    const xString = x.split("");
    const yString = y.split("");
    let highest = null;
    for (let i = 0; i < xString.length; i++) {
      const xCardType =
        part === 1
          ? this.getCardTypePartOne(xString[i])
          : this.getCardTypePartTwo(xString[i]);
      const yCardType =
        part === 1
          ? this.getCardTypePartOne(yString[i])
          : this.getCardTypePartTwo(yString[i]);
      if (xCardType === yCardType) {
        continue;
      }

      if (xCardType > yCardType) {
        highest = x;
        break;
      }

      if (xCardType < yCardType) {
        highest = y;
        break;
      }
    }

    return highest;
  }
}

new DaySeven();
