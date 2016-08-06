import FilterIterator from "./filter_iterator";
import MapIterator from "./map_iterator";
import {Predicate} from "./predicate";
import TakeIterator from "./take_iterator";
import SkipIterator from "./skip_iterator";
import FlattenIterator from "./flatten_iterator";

export default class Enumerable<T> {
  constructor(private iterable: Iterable<T>) {}

  [Symbol.iterator](): Iterator<T> {
    return this.iterable[Symbol.iterator]();
  }

  public every(predicate: Predicate<T>): boolean {
    let iterator = this.iterator();
    while (true) {
      let next = iterator.next();
      if (next.done) {
        return true;
      } else if (!predicate(next.value)) {
        return false;
      }
    }
  }

  public expand(expansion: (e: T) => T[]): Enumerable<T[]> {
    return new Enumerable(this.reduce((elements, element) => {
      elements.push(expansion(element));
      return elements;
    }, []));
  }

  public filter(predicate: Predicate<T>): Enumerable<T> {
    const iterator = this.iterator();
    return new Enumerable({
      [Symbol.iterator]() {
        return new FilterIterator(iterator, predicate);
      }
    })
  }

  public flatten(): Enumerable<T> {
    let iterator = this.iterator();
    return new Enumerable({
      [Symbol.iterator]() {
        return new FlattenIterator(iterator);
      }
    })
  }

  public join(separator = ""): string {
    let initialValue = (this.first || "").toString();
    let skipped = this.skip(1);
    return skipped.reduce((str, element) => `${str}${separator}${element}`, initialValue);
  }

  public map<R>(block: (value: T) => R): Enumerable<R> {
    const iterator = this.iterator();
    return new Enumerable<R>({
      [Symbol.iterator]() {
        return new MapIterator(iterator, block);
      }
    });
  }

  public reduce(accumulator: (prev: T, element: T) => T, initialValue?: T): T | undefined;
  public reduce<R>(accumulator: (prev: R, element: T) => R, initialValue: R): R;

  public reduce<R>(accumulator: (prev: R | T, element: T) => R, initialValue?: R): R | T | undefined {
    let iterator = this.iterator();
    let accumulated = initialValue !== undefined ? initialValue : iterator.next().value;

    while (true) {
      let result = iterator.next();
      if (result.done) {
        break;
      } else {
        accumulated = accumulator(accumulated, result.value);
      }
    }

    return accumulated;
  }

  public forEach(block: (value: T) => void): void {
    let iterator = this.iterator();
    while (true) {
      let result = iterator.next();
      if (result.done) {
        break;
      } else {
        block(result.value);
      }
    }
  }

  public skip(count: number): Enumerable<T> {
    let iterator = this.iterator();
    return new Enumerable({
      [Symbol.iterator]() {
        return new SkipIterator(iterator, count);
      }
    });
  }

  public some(predicate: Predicate<T>): boolean {
    let iterator = this.iterator();
    while (true) {
      let next = iterator.next();
      if (next.done) {
        return false;
      } else if (predicate(next.value)) {
        return true;
      }
    }
  }

  public take(count: number): Enumerable<T> {
    let iterator = this.iterator();
    return new Enumerable({
      [Symbol.iterator]() {
        return new TakeIterator(iterator, count);
      }
    });
  }

  public toArray(): T[] {
    return this.reduce((values, value) => {
      values.push(value);
      return values;
    }, []);
  }

  public get first(): T | null {
    return this.iterator().next().value || null;
  }

  public get last(): T | null {
    let iterator = this.iterator();
    let last = null;
    while (true) {
      let next = iterator.next();
      if (next.done) {
        return last;
      } else {
        last = next.value;
      }
    }
  }

  public get length(): number {
    return this.reduce((i, _) => i + 1, 0);
  }

  public get isEmpty(): boolean {
    return this.iterator().next().done;
  }

  public get isNotEmpty(): boolean {
    return !this.isEmpty;
  }

  protected iterator(): Iterator<T> {
    return this[Symbol.iterator]();
  }
}
