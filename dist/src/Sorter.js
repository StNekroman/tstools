"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sorter = void 0;
const Functions_1 = require("./Functions");
const Objects_1 = require("./Objects");
class Sorter {
    static byField(fieldname) {
        return new Sorter(fieldname);
    }
    static byExtractor(extractor) {
        return new Sorter(extractor);
    }
    constructor(extractorOrFieldname) {
        this._nullsLast = true;
        this._inverse = false;
        if (Objects_1.Objects.isFunction(extractorOrFieldname)) {
            this.extractor = extractorOrFieldname;
        }
        else {
            this.extractor = Functions_1.Functions.extractor(extractorOrFieldname);
        }
    }
    nullsLast(value) {
        this._nullsLast = value;
        return this;
    }
    inverse() {
        this._inverse = !this._inverse;
        return this;
    }
    stringCollatorOptions(value) {
        this._stringCollatorOptions = value;
        return this;
    }
    build(nextSort) {
        return (a, b) => {
            const avalue = this.extractor(a);
            const bvalue = this.extractor(b);
            const result = this.compareValues(avalue, bvalue);
            if (result === 0 && Objects_1.Objects.isNotNullOrUndefined(nextSort)) {
                return nextSort(a, b);
            }
            return result;
        };
    }
    compareValues(avalue, bvalue) {
        const nullCheck = this._nullsLast ? Sorter.COMPARATORS.null(avalue, bvalue) : -1 * Sorter.COMPARATORS.null(avalue, bvalue);
        if (nullCheck !== 0) {
            return nullCheck;
        }
        let result;
        if (Objects_1.Objects.isString(avalue) && Objects_1.Objects.isString(bvalue)) {
            result = Sorter.COMPARATORS.string(avalue, bvalue, this._stringCollatorOptions);
        }
        else if (Objects_1.Objects.isNumeric(avalue) && Objects_1.Objects.isNumeric(bvalue)) {
            result = Sorter.COMPARATORS.number(avalue, bvalue);
        }
        else if (Objects_1.Objects.isBoolean(avalue) && Objects_1.Objects.isBoolean(bvalue)) {
            result = Sorter.COMPARATORS.boolean(avalue, bvalue);
        }
        else if (avalue instanceof Date && bvalue instanceof Date) {
            result = Sorter.COMPARATORS.Date(avalue, bvalue);
        }
        else if (!Objects_1.Objects.isNotNullOrUndefined && !Objects_1.Objects.isNotNullOrUndefined(bvalue)) {
            result = nullCheck;
        }
        else {
            throw new Error("Not supported combination of types");
        }
        if (this._inverse) {
            result = -1 * result;
        }
        return result;
    }
}
exports.Sorter = Sorter;
Sorter.COMPARATORS = {
    get number() {
        return (a, b) => a - b;
    },
    get string() {
        return (a, b, stringCompareOptions) => a.localeCompare(b, undefined, stringCompareOptions);
    },
    get boolean() {
        return (a, b) => {
            if (!a && b) {
                return 1;
            }
            else if (a && !b) {
                return -1;
            }
            else {
                return 0;
            }
        };
    },
    get Date() {
        return (a, b) => {
            return a.getTime() - b.getTime();
        };
    },
    get null() {
        return (a, b) => {
            if (!Objects_1.Objects.isNotNullOrUndefined(a) && Objects_1.Objects.isNotNullOrUndefined(b)) {
                return 1;
            }
            else if (Objects_1.Objects.isNotNullOrUndefined(a) && !Objects_1.Objects.isNotNullOrUndefined) {
                return -1;
            }
            else {
                return 0;
            }
        };
    }
};
