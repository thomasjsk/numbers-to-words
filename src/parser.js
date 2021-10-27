const EMPTY = "";
export const dict = {
  ones: {
    0: "zero",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
  },
  teens: {
    withDefaultPostfix: (value) => value + "teen",
    10: "ten",
    11: "eleven",
    12: "twelve",
    13: "thirteen",
    15: "fifteen",
    18: "eighteen",
  },
  tens: {
    withDefaultPostfix: (value) => value + "ty",
    2: "twenty",
    3: "thirty",
    4: "forty",
    5: "fifty",
    8: "eighty",
  },
  hundreds: {
    withDefaultPostfix: (value) => value + " hundred",
  },
  postfixes: ["thousand", "million"],
};

const parseSingleDigit = (value) => {
  return dict.ones[value];
};

const parseDoubleDigit = (value) => {
  // 20 > x > 9
  if (value < 20) {
    return (
      dict.teens[value] ||
      dict.teens.withDefaultPostfix(dict.ones[Math.floor(value - 10)])
    );
  }

  // 100 > x > 19
  if (value < 100) {
    const index = Math.floor(value / 10);

    const result =
      dict.tens[index] || dict.tens.withDefaultPostfix(dict.ones[index]);

    if (value % 10 === 0) return result; // Dividable by 10 (20, 30, etc.)

    return result + " " + dict.ones[value % 10]; // Non dividable by 10 (21, 55, 73 etc.)
  }

  return value;
};

export const parseBlockOfThree = (value) => {
  // Single digit (x < 10)
  if (value < 10) return parseSingleDigit(value);

  // Double digit (100 > x > 9)
  if (100 > value && value > 9) return parseDoubleDigit(value);

  // Triple digit (1000 > x > 99)
  if (value < 1000) {
    const index = Math.floor(value / 100);

    const result = dict.hundreds.withDefaultPostfix(dict.ones[index]);

    if (value % 100 === 0) return result;

    const lastTwoDigits = value % 100;
    return (
      result +
      " " +
      (lastTwoDigits > 9
        ? parseDoubleDigit(lastTwoDigits)
        : parseSingleDigit(lastTwoDigits))
    );
  }

  return value;
};

export const getBlock = (stringValue, blockIndex) => {
  const size = stringValue.length;

  return Number(
    stringValue.slice(
      Math.max(0, size - 3 * (blockIndex + 1)),
      size - 3 * blockIndex
    )
  );
};

const toBlocks = (stringValue) => {
  const size = stringValue.length;
  let i = 0;
  const blocks = [];

  while (i < size / 3) {
    blocks.push(getBlock(stringValue, i));

    i++;
  }

  return blocks;
};

const withPostfix = (value, blockIndex) => {
  if (blockIndex < 0) return value;

  return `${value} ${dict.postfixes[blockIndex]}`;
};

export const parse = (value) => {
  const sanitized = value.replace(" ", ""); // Clear whitespaces

  if (!sanitized.length) return EMPTY; // Empty string
  if (sanitized.length > 9) throw new Error(); // Overflow

  const numValue = Number(sanitized);

  if (!Number.isInteger(numValue)) throw new Error(); // Not a number
  if (numValue === 0) return "zero"; // Multiple 0's

  return toBlocks(value)
    .map((block, i) => withPostfix(parseBlockOfThree(block), i - 1))
    .reverse()
    .join(" and ");
};
