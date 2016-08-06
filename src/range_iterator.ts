import Enumerable from "./enumerable";

class RangeIterator implements Iterator<number> {
  private nextValue: number;

  constructor(private start: number, private stop: number, private step: number) {
    if (step > 0) {
      this.nextValue = start;
    } else {
      throw new RangeError(`Step in range should be greater than 0, was ${step}`);
    }
  }

  public next(): IteratorResult<number> {
    if (this.nextValue < this.stop) {
      let value = this.nextValue;
      this.nextValue = value + this.step;
      return {value: value, done: false};
    } else {
      return {value: undefined, done: true};
    }
  }
}

export default function(start: number, stop: number, step = 1): Enumerable<number> {
  return new Enumerable({
    [Symbol.iterator]() {
      return new RangeIterator(start, stop, step);
    }
  })
}
