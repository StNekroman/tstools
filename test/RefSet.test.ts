import { beforeEach, describe, expect, test } from '@jest/globals';
import { RefCountedValue } from '../src/caching/RefCountedValue';
import { RefSet } from '../src/caching/RefSet';

describe('RefSet', () => {
  let refSet: RefSet<string>;
  let internalMap: Map<string, RefCountedValue<void>>;

  beforeEach(() => {
    refSet = new RefSet<string>();
    internalMap = refSet['map'];
  });

  test('should add a new key and create a RefCountedValue', () => {
    refSet.add('foo');
    expect(refSet.has('foo')).toBe(true);
    expect(internalMap.get('foo')?.getRefCount()).toBe(1);
  });

  test('should increment RefCountedValue if key already exists', () => {
    refSet.add('bar');
    refSet.add('bar');
    expect(refSet.has('bar')).toBe(true);
    expect(internalMap.get('bar')?.getRefCount()).toBe(2);
  });

  test('should decrement on deletion', () => {
    refSet.add('bar');
    refSet.add('bar');
    expect(refSet.has('bar')).toBe(true);
    expect(internalMap.get('bar')?.getRefCount()).toBe(2);

    refSet.delete('bar');
    expect(refSet.has('bar')).toBe(true);
    expect(internalMap.get('bar')?.getRefCount()).toBe(1);

    refSet.delete('bar');
    expect(refSet.has('bar')).toBe(false);
  });
});
