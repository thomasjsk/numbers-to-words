import { dict, getBlock, parse } from "./parser";

function assert(value, expected) {
  expect(parse(value.toString())).toEqual(expected);
}

describe("getBlock", () => {
  const value = 123456789;

  describe(`for value ${value}`, () => {
    const stringValue = value.toString();
    const expected = [789, 456, 123];

    for (let i = 0; i < stringValue.length / 3; i++) {
      it(`should return ${expected[i]} for blockIndex ${i}`, () => {
        expect(getBlock(stringValue, i)).toEqual(expected[i]);
      });
    }
  });
});

describe("parser", () => {
  describe("throws error", () => {
    describe("invalid input", () => {
      const testCases = [
        { value: "12a", label: "provided value contains string" },
        { value: "111$4", label: "provided value contains non numeric char" },
      ];

      testCases.forEach(({ label, value }) => {
        it(`should throw error if ${label}`, () => {
          expect(() => parse(value)).toThrowError();
        });
      });
    });

    describe("input overflow", () => {
      it("should throw error if input is too long", () => {
        expect(() => parse("1111111111")).toThrowError();
      });
    });
  });

  describe(`multiple 0's`, () => {
    it('should return "zero" if typed n*(0)', () => {
      assert("00000", "zero");
    });
  });

  describe("single digits", () => {
    Object.keys(dict.ones).forEach((key) => {
      const value = key;
      const expected = dict.ones[value];

      it(`should parse ${value} to ${expected}`, () => {
        assert(value, expected);
      });
    });
  });

  describe("teens", () => {
    describe("default", () => {
      [
        [14, "fourteen"],
        [16, "sixteen"],
        [17, "seventeen"],
        [18, "eighteen"],
        [19, "nineteen"],
      ].forEach(([value, expected]) => {
        it(`should return "${expected}" for ${value}`, () => {
          assert(value, expected);
        });
      });
    });

    describe("unique", () => {
      [10, 11, 12, 13, 15].forEach((value) => {
        const expected = dict.teens[value];

        it(`should return "${expected}" for ${value}`, () => {
          assert(value, expected);
        });
      });
    });
  });

  describe("tens", () => {
    describe("dividable by 10", () => {
      describe("default", () => {
        [
          [60, "sixty"],
          [70, "seventy"],
          [90, "ninety"],
        ].forEach(([value, expected]) => {
          it(`should return "${expected}" for ${value}`, () => {
            assert(value, expected);
          });
        });
      });

      describe("unique", () => {
        [20, 30, 40, 50, 80].forEach((value) => {
          const expected = dict.tens[value / 10];

          it(`should return "${expected}" for ${value}`, () => {
            assert(value, expected);
          });
        });
      });
    });

    describe("NON dividable by 10", () => {
      it("default", () => {
        const value = 91;
        const expected = "ninety one";

        expect(parse(value.toString())).toEqual(expected);
      });

      it("unique", () => {
        const value = 23;
        const expected = "twenty three";

        assert(value, expected);
      });
    });
  });

  describe("hundreds", () => {
    describe("dividable by 100", () => {
      const [, ...testCases] = [...Array(10).keys()].map((value) => ({
        value: value * 100,
        expected: dict.ones[value] + " hundred",
      }));

      testCases.forEach(({ value, expected }) => {
        it(`should return "${expected}" for ${value}`, () => {
          assert(value, expected);
        });
      });
    });

    describe("NON dividable by 100", () => {
      [
        [104, "one hundred four"],
        [250, "two hundred fifty"],
        [793, "seven hundred ninety three"],
      ].forEach(([value, expected]) => {
        it(`should return "${expected}" for ${value}`, () => {
          assert(value, expected);
        });
      });
    });
  });

  describe("three blocks", () => {
    const testCases = [
      [
        1234567,
        `one million and two hundred thirty four thousand and five hundred sixty seven`,
      ],
      [
        12345678,
        "twelve million and three hundred forty five thousand and six hundred seventy eight",
      ],
      [
        123456789,
        "one hundred twenty three million and four hundred fifty six thousand and seven hundred eighty nine",
      ],
      [
        999999999,
        "nine hundred ninety nine million and nine hundred ninety nine thousand and nine hundred ninety nine",
      ],
    ];

    testCases.forEach(([value, expected]) => {
      it(`should return "${expected}" for ${value}`, () => {
        assert(value, expected);
      });
    });
  });
});
