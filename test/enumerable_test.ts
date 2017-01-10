import {expect} from "chai";
import {enumerate, range} from "../src/main.ts";

describe("Enumerable", () => {
  describe("#every()", () => {
    it("returns true when all values satisfy predicate", () => {
      let enumerable = enumerate([1, 2, 3]);
      expect(enumerable.every(n => n > 0)).to.be.true;
    });

    it("returns false when one value doesn't satisfy predicate", () => {
      let enumerable = enumerate([1, 2, 3]);
      expect(enumerable.every(n => n > 1)).to.be.false;
    });
  });

  describe("#some()", () => {
    it("returns true when one value satisfies predicate", () => {
      let enumerable = enumerate([1, 2, 3]);
      expect(enumerable.some(n => n === 1)).to.be.true;
    });

    it("returns false when no values satisfy predicate", () => {
      let enumerable = enumerate([1, 2, 3]);
      expect(enumerable.some(n => n > 3)).to.be.false;
    });
  });

  describe("#filter()", () => {
    it("should only contain elements satisfying predicate", () => {
      let enumerable = enumerate([1, 2, 3, 4, 5]).filter(i => i % 2 === 0);
      let expected = [2, 4];
      expect(enumerable.toArray()).to.eql(expected);
    });
  });

  describe("#flatten()", () => {
    it("should reduce an iterable of iterables into a flat iterable", () => {
      let enumerable = enumerate([1, [2, 3], [[4, 5], [[6]]], 7]).flatten();
      let expected = [1, 2, 3, 4, 5, 6, 7];
      expect(enumerable.toArray()).to.eql(expected);
    });
  });

  describe("#expand()", () => {
    it("returns an array of arrays", () => {
      let enumerable = enumerate([1, 2, 3]).expand(i => [i - 1, i]);
      let expected = [[0, 1], [1, 2], [2, 3]];
      expect(enumerable.toArray()).to.eql(expected);
    });
  });

  describe("#forEach()", () => {
    it("should iterate through each value", () => {
      let expected = [1, 2, 3];
      let actual = [];
      enumerate([1, 2, 3]).forEach(v => actual.push(v));
      expect(actual).to.eql(expected);
    })
  });

  describe("#join()", () => {
    it("converts each element to a string and concatenates each string", () => {
      let enumerable = enumerate([1, 2, 3]);
      let expected = "1, 2, 3";
      expect(enumerable.join(", ")).to.eql(expected);
    });

    it("returns an empty string when enumerable is empty", () => {
      expect(enumerate([]).join(", ")).to.eql("");
    });
  });

  describe("#map()", () => {
    it("should map each value", () => {
      let enumerable = enumerate([1, 2, 3]).map(value => value + 1);
      let expected = [2, 3, 4];
      expect(enumerable.toArray()).to.eql(expected);
    });
  });

  describe("#reduce()", () => {
    context("with initial value", () => {
      it("uses initial value for accumulator", () => {
        let enumerable = enumerate([1, 2, 3]);
        let actual = enumerable.reduce((prev, element) => prev + element, 1);
        expect(actual).to.eql(7);
      });
    });

    context("without initial value", () => {
      it("uses first value for accumulator", () => {
        let enumerable = enumerate([1, 2, 3]);
        let actual = enumerable.reduce((prev, element) => prev + element);
        expect(actual).to.eql(6);
      });
    });
  });

  describe("#take()", () => {
    context("when value less than length", () => {
      it("should return subset of elements", () => {
        let enumerable = enumerate([1, 2, 3]);
        expect(enumerable.take(2).toArray()).to.eql([1, 2]);
      });
    });

    context("when value greater than length", () => {
      it("returns all elements", () => {
        let enumerable = enumerate([1, 2, 3]);
        expect(enumerable.take(5).toArray()).to.eql([1, 2, 3]);
      });
    });
  });

  describe("#toArray()", () => {
    it("should return an ordered array with each value", () => {
      let enumerable = enumerate([1, 2, 3]);
      let expected = [1, 2, 3];
      expect(enumerable.toArray()).to.eql(expected);
    });

    it("should return a new array for each call", () => {
      let enumerable = enumerate([1, 2, 3]);
      let result1 = enumerable.toArray();
      let result2 = enumerable.toArray();
      expect(result1.length).to.eql(3);
      expect(result2.length).to.eql(3);
      expect(result1).to.not.eq(result2);
    });
  });

  describe("#skip()", () => {
    context("when count is 0", () => {
      it("should return all elements", () => {
        let enumerable = enumerate([1, 2, 3, 4, 5]).skip(0);
        let expected = [1, 2, 3, 4, 5];
        expect(enumerable.toArray()).to.eql(expected);
      });
    });

    context("when count is less than length", () => {
      it("should skip first N elements", () => {
        let enumerable = enumerate([1, 2, 3, 4, 5]).skip(2);
        let expected = [3, 4, 5];
        expect(enumerable.toArray()).to.eql(expected);
      });
    });

    context("when count is equal to length", () => {
      it("should be empty", () => {
        let enumerable = enumerate([1, 2, 3]).skip(3);
        let expected = [];
        expect(enumerable.toArray()).to.eql(expected);
      });
    });

    context("when count is greater than length", () => {
      it("should be empty", () => {
        let enumerable = enumerate([1, 2, 3]).skip(4);
        let expected = [];
        expect(enumerable.toArray()).to.eql(expected);
      });
    });
  });

  describe("#first", () => {
    it("should return the first element when not empty", () => {
      let enumerable = enumerate([1, 2]);
      expect(enumerable.first).to.eql(1);
    });

    it("should return null when empty", () => {
      let enumerable = enumerate([]);
      expect(enumerable.first).to.be.null;
    });
  });

  describe("#last", () => {
    it("should return the last element when not empty", () => {
      let enumerable = enumerate([1, 2, 3]);
      expect(enumerable.last).to.eql(3);
    });

    it("should return null when empty", () => {
      let enumerable = enumerate([]);
      expect(enumerable.first).to.be.null;
    });
  });

  describe("#length", () => {
    it("should return the number of elements", () => {
      expect(enumerate([1, 2, 3]).length).to.eql(3);
    });
  });

  describe("#isEmpty", () => {
    it("should return true when not empty", () => {
      let enumerable = enumerate([]);
      expect(enumerable.isEmpty).to.eql(true);
    });

    it("should return false when not empty", () => {
      let enumerable = enumerate([1, 2]);
      expect(enumerable.isEmpty).to.eql(false);
    });
  });

  describe("#isNotEmpty", () => {
    it("should return false when not empty", () => {
      let enumerable = enumerate([1, 2]);
      expect(enumerable.isNotEmpty).to.eql(true);
    });

    it("should return true when not empty", () => {
      let enumerable = enumerate([]);
      expect(enumerable.isNotEmpty).to.eql(false);
    });
  });
});

describe("range()", () => {
  context("when step positive", () => {
    it("should iterate from start to end by step", () => {
      let nums = range(0, 5, 2).toArray();
      expect(nums).to.eql([0, 2, 4]);
    });
  });

  context("when step non-positive", () => {
    it("should throw an error", () => {
      expect(() => range(0, 5, 0).toArray()).to.throw(RangeError);
    });
  });
});
