import Enumerable from "./enumerable";

export default function<T>(iterable: Iterable<T>): Enumerable<T> {
  return new Enumerable(iterable);
}
