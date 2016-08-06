export default class SkipIterator<T> implements Iterator<T> {
  constructor(private iterator: Iterator<T>, private count: number) {
    for (let i = 0; i < this.count; i++) {
      this.iterator.next();
    }
  }

  public next(): IteratorResult<T> {
    return this.iterator.next();
  }
}
