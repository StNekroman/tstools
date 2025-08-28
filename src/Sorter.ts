import { Functions } from './Functions';
import { Objects } from './Objects';
import { Types } from './Types';

export type SortableType = string | number | Date | boolean;

export class Sorter<T> {
  public static readonly COMPARATORS = {
    get number() {
      return (a: number, b: number) => a - b;
    },
    get string() {
      return (a: string, b: string, stringCompareOptions?: Intl.CollatorOptions) =>
        a.localeCompare(b, undefined, stringCompareOptions);
    },
    get boolean() {
      return (a: boolean, b: boolean) => {
        if (!a && b) {
          return 1;
        } else if (a && !b) {
          return -1;
        } else {
          return 0;
        }
      };
    },
    get Date() {
      return (a: Date, b: Date) => {
        return a.getTime() - b.getTime();
      };
    },
    get null() {
      return (a: SortableType, b: SortableType) => {
        if (!Objects.isNotNullOrUndefined(a) && Objects.isNotNullOrUndefined(b)) {
          return 1;
        } else if (Objects.isNotNullOrUndefined(a) && !Objects.isNotNullOrUndefined) {
          return -1;
        } else {
          return 0;
        }
      };
    },
  };

  private _nullsLast: boolean = true;
  private _stringCollatorOptions?: Intl.CollatorOptions;
  private _inverse: boolean = false;
  private readonly extractor: Functions.MapFunction<T, SortableType>;

  public static byField<T>(fieldname: keyof T & Types.KeysWithValsOfType<T, SortableType>): Sorter<T> {
    return new Sorter<T>(fieldname);
  }

  public static byExtractor<T>(extractor: Functions.MapFunction<T, SortableType>): Sorter<T> {
    return new Sorter(extractor);
  }

  private constructor(
    extractorOrFieldname: Functions.MapFunction<T, SortableType> | (keyof T & Types.KeysWithValsOfType<T, SortableType>)
  ) {
    if (Objects.isFunction(extractorOrFieldname)) {
      this.extractor = extractorOrFieldname;
    } else {
      this.extractor = Functions.extractor(extractorOrFieldname) as Functions.MapFunction<T, SortableType>;
    }
  }

  public nullsLast(value: boolean): this {
    this._nullsLast = value;
    return this;
  }

  public inverse(): this {
    this._inverse = !this._inverse;
    return this;
  }

  public stringCollatorOptions(value: Intl.CollatorOptions): this {
    this._stringCollatorOptions = value;
    return this;
  }

  public build(nextSort?: Functions.Comparator<T>): Functions.Comparator<T> {
    return (a: T, b: T): number => {
      const avalue: SortableType = this.extractor(a);
      const bvalue: SortableType = this.extractor(b);
      const result = this.compareValues(avalue, bvalue);
      if (result === 0 && Objects.isNotNullOrUndefined(nextSort)) {
        return nextSort(a, b);
      }
      return result;
    };
  }

  private compareValues(avalue: SortableType, bvalue: SortableType): number {
    const nullCheck: number = this._nullsLast
      ? Sorter.COMPARATORS.null(avalue, bvalue)
      : -1 * Sorter.COMPARATORS.null(avalue, bvalue);
    if (nullCheck !== 0) {
      return nullCheck;
    }

    let result: number;
    if (Objects.isString(avalue) && Objects.isString(bvalue)) {
      result = Sorter.COMPARATORS.string(avalue, bvalue, this._stringCollatorOptions);
    } else if (Objects.isNumeric(avalue) && Objects.isNumeric(bvalue)) {
      result = Sorter.COMPARATORS.number(avalue, bvalue);
    } else if (Objects.isBoolean(avalue) && Objects.isBoolean(bvalue)) {
      result = Sorter.COMPARATORS.boolean(avalue, bvalue);
    } else if (avalue instanceof Date && bvalue instanceof Date) {
      result = Sorter.COMPARATORS.Date(avalue, bvalue);
    } else {
      result = nullCheck;
    }

    if (this._inverse) {
      result = -1 * result;
    }
    return result;
  }
}
