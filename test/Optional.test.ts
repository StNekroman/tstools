import { describe, expect, test } from '@jest/globals';
import { Optional } from '../src';

describe('Optional', () => {
  test('isEmpty / isPresent', () => {
    expect(Optional.of(undefined).isEmpty()).toBeTruthy();
    expect(Optional.of(null).isEmpty()).toBeTruthy();
    expect(Optional.empty().isEmpty()).toBeTruthy();

    expect(Optional.of(1).isPresent()).toBeTruthy();
    expect(Optional.of('1').isPresent()).toBeTruthy();
    expect(Optional.of(false).isPresent()).toBeTruthy();
  });

  test('equals', () => {
    expect(Optional.of(undefined) === Optional.empty()).toBeTruthy();
    expect(Optional.of(undefined).equals(Optional.empty())).toBeTruthy();
    expect(Optional.of(null).equals(Optional.empty())).toBeTruthy();
    expect(Optional.empty().equals(Optional.empty())).toBeTruthy();
  });

  test('get', () => {
    expect(Optional.of(1).get()).toBe(1);
    expect(Optional.of('1').get()).toBe('1');

    expect(() => Optional.of(undefined).get()).toThrow();
    expect(Optional.of<number>(undefined).orElse(1)).toBe(1);
    expect(Optional.of<number>(undefined).orElseGet(() => 1)).toBe(1);
    expect(
      Optional.of<number>(undefined)
        .or(() => Optional.of(1))
        .get()
    ).toBe(1);
  });

  test('map / filter', () => {
    expect(
      Optional.of(2)
        .map((i) => i * i)
        .get()
    ).toBe(4);
    expect(
      Optional.of(2)
        .flatMap((i) => Optional.of(i * i))
        .get()
    ).toBe(4);
    expect(
      Optional.of(2)
        .filter((i) => i === 2)
        .isPresent()
    ).toBeTruthy();
    expect(
      Optional.of(2)
        .filter((i) => i !== 2)
        .isPresent()
    ).toBeFalsy();
  });

  test('property', () => {
    const v1 = Optional.of({ a: 3, b: { c: 4 } });
    const v2 = v1.property('b');
    const v3 = v2.property('c');
    expect(v3.get()).toBe(4);
  });
});
