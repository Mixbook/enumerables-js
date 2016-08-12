var FilterIterator = (function () {
    function FilterIterator(iterator, predicate) {
        this.iterator = iterator;
        this.predicate = predicate;
    }
    FilterIterator.prototype.next = function () {
        var next = this.iterator.next();
        if (!next.done) {
            if (this.predicate(next.value)) {
                return next;
            }
            else {
                return this.next();
            }
        }
        else {
            return { value: undefined, done: true };
        }
    };
    return FilterIterator;
}());

var MapIterator = (function () {
    function MapIterator(iterator, block) {
        this.iterator = iterator;
        this.block = block;
    }
    MapIterator.prototype.next = function () {
        var next = this.iterator.next();
        if (!next.done) {
            return { value: this.block(next.value), done: false };
        }
        else {
            return { value: undefined, done: true };
        }
    };
    return MapIterator;
}());

var TakeIterator = (function () {
    function TakeIterator(iterator, count) {
        this.iterator = iterator;
        this.count = count;
        this.index = 0;
    }
    TakeIterator.prototype.next = function () {
        return this.index++ < this.count ? this.iterator.next() : { value: undefined, done: true };
    };
    return TakeIterator;
}());

var SkipIterator = (function () {
    function SkipIterator(iterator, count) {
        this.iterator = iterator;
        this.count = count;
        for (var i = 0; i < this.count; i++) {
            this.iterator.next();
        }
    }
    SkipIterator.prototype.next = function () {
        return this.iterator.next();
    };
    return SkipIterator;
}());

function isIterable(value) {
    return value[Symbol.iterator] !== undefined;
}

var FlattenIterator = (function () {
    function FlattenIterator(iterator) {
        this.iterator = iterator;
        this.iterators = [iterator];
    }
    FlattenIterator.prototype.next = function () {
        if (this.iterators.length > 0) {
            var next = this.iterators[0].next();
            if (next.done) {
                this.iterators.shift();
                return this.next();
            }
            else if (isIterable(next.value)) {
                this.iterators.unshift(next.value[Symbol.iterator]());
                return this.next();
            }
            else {
                return next;
            }
        }
        else {
            return { value: undefined, done: true };
        }
    };
    return FlattenIterator;
}());

var Enumerable = (function () {
    function Enumerable(iterable) {
        this.iterable = iterable;
    }
    Enumerable.prototype[Symbol.iterator] = function () {
        return this.iterable[Symbol.iterator]();
    };
    Enumerable.prototype.every = function (predicate) {
        var iterator = this.iterator();
        while (true) {
            var next = iterator.next();
            if (next.done) {
                return true;
            }
            else if (!predicate(next.value)) {
                return false;
            }
        }
    };
    Enumerable.prototype.expand = function (expansion) {
        return new Enumerable(this.reduce(function (elements, element) {
            elements.push(expansion(element));
            return elements;
        }, []));
    };
    Enumerable.prototype.filter = function (predicate) {
        var iterator = this.iterator();
        return new Enumerable((_a = {},
            _a[Symbol.iterator] = function () {
                return new FilterIterator(iterator, predicate);
            },
            _a
        ));
        var _a;
    };
    Enumerable.prototype.flatten = function () {
        var iterator = this.iterator();
        return new Enumerable((_a = {},
            _a[Symbol.iterator] = function () {
                return new FlattenIterator(iterator);
            },
            _a
        ));
        var _a;
    };
    Enumerable.prototype.join = function (separator) {
        if (separator === void 0) { separator = ""; }
        var initialValue = (this.first || "").toString();
        var skipped = this.skip(1);
        return skipped.reduce(function (str, element) { return ("" + str + separator + element); }, initialValue);
    };
    Enumerable.prototype.map = function (block) {
        var iterator = this.iterator();
        return new Enumerable((_a = {},
            _a[Symbol.iterator] = function () {
                return new MapIterator(iterator, block);
            },
            _a
        ));
        var _a;
    };
    Enumerable.prototype.reduce = function (accumulator, initialValue) {
        var iterator = this.iterator();
        var accumulated = initialValue !== undefined ? initialValue : iterator.next().value;
        while (true) {
            var result = iterator.next();
            if (result.done) {
                break;
            }
            else {
                accumulated = accumulator(accumulated, result.value);
            }
        }
        return accumulated;
    };
    Enumerable.prototype.forEach = function (block) {
        var iterator = this.iterator();
        while (true) {
            var result = iterator.next();
            if (result.done) {
                break;
            }
            else {
                block(result.value);
            }
        }
    };
    Enumerable.prototype.skip = function (count) {
        var iterator = this.iterator();
        return new Enumerable((_a = {},
            _a[Symbol.iterator] = function () {
                return new SkipIterator(iterator, count);
            },
            _a
        ));
        var _a;
    };
    Enumerable.prototype.some = function (predicate) {
        var iterator = this.iterator();
        while (true) {
            var next = iterator.next();
            if (next.done) {
                return false;
            }
            else if (predicate(next.value)) {
                return true;
            }
        }
    };
    Enumerable.prototype.take = function (count) {
        var iterator = this.iterator();
        return new Enumerable((_a = {},
            _a[Symbol.iterator] = function () {
                return new TakeIterator(iterator, count);
            },
            _a
        ));
        var _a;
    };
    Enumerable.prototype.toArray = function () {
        return this.reduce(function (values, value) {
            values.push(value);
            return values;
        }, []);
    };
    Object.defineProperty(Enumerable.prototype, "first", {
        get: function () {
            return this.iterator().next().value || null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Enumerable.prototype, "last", {
        get: function () {
            var iterator = this.iterator();
            var last = null;
            while (true) {
                var next = iterator.next();
                if (next.done) {
                    return last;
                }
                else {
                    last = next.value;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Enumerable.prototype, "length", {
        get: function () {
            return this.reduce(function (i, _) { return i + 1; }, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Enumerable.prototype, "isEmpty", {
        get: function () {
            return this.iterator().next().done;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Enumerable.prototype, "isNotEmpty", {
        get: function () {
            return !this.isEmpty;
        },
        enumerable: true,
        configurable: true
    });
    Enumerable.prototype.iterator = function () {
        return this[Symbol.iterator]();
    };
    return Enumerable;
}());

function enumerate (iterable) {
    return new Enumerable(iterable);
}

var RangeIterator = (function () {
    function RangeIterator(start, stop, step) {
        this.start = start;
        this.stop = stop;
        this.step = step;
        if (step > 0) {
            this.nextValue = start;
        }
        else {
            throw new RangeError("Step in range should be greater than 0, was " + step);
        }
    }
    RangeIterator.prototype.next = function () {
        if (this.nextValue < this.stop) {
            var value = this.nextValue;
            this.nextValue = value + this.step;
            return { value: value, done: false };
        }
        else {
            return { value: undefined, done: true };
        }
    };
    return RangeIterator;
}());
function range_iterator (start, stop, step) {
    if (step === void 0) { step = 1; }
    return new Enumerable((_a = {},
        _a[Symbol.iterator] = function () {
            return new RangeIterator(start, stop, step);
        },
        _a
    ));
    var _a;
}

export { enumerate, range_iterator as range, Enumerable };