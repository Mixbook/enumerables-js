import {isIterable} from "./utils";

export default class FlattenIterator<T> implements Iterator<T> {
  private iterators: Iterator<T>[];

  constructor(private iterator: Iterator<T>) {
    this.iterators = [iterator];
  }

  public next(): IteratorResult<T> {
    if (this.iterators.length > 0) {
      let next = this.iterators[0].next();
      if (next.done) {
        this.iterators.shift();
        return this.next();
      } else if (isIterable(next.value)) {
        this.iterators.unshift(next.value[Symbol.iterator]());
        return this.next();
      } else {
        return next;
      }
    } else {
      return {value: undefined, done: true};
    }
  }
}
