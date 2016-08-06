import {Predicate} from "./predicate";

export default class FilterIterator<T> implements Iterator<T> {
  constructor(private iterator: Iterator<T>, private predicate: Predicate<T>) {}

  public next(): IteratorResult<T> {
    let next = this.iterator.next();
    if (!next.done) {
      if (this.predicate(next.value)) {
        return next;
      } else {
        return this.next();
      }
    } else {
      return {value: undefined, done: true};
    }
  }
}
