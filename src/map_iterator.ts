export default class MapIterator<T, R> implements Iterator<R> {
  constructor(private iterator: Iterator<T>, private block: (value: T) => R) {}

  public next(): IteratorResult<R> {
    let next = this.iterator.next();
    if (!next.done) {
      return {value: this.block(next.value), done: false};
    } else {
      return {value: undefined, done: true};
    }
  }
}
