export default class TakeIterator<T> implements Iterator<T> {
  private index = 0;

  constructor(private iterator: Iterator<T>, private count: number) {}

  public next(): IteratorResult<T> {
    return this.index++ < this.count ? this.iterator.next() : {value: undefined, done: true};
  }
}
