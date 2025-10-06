import { describe, expect, jest, test } from '@jest/globals';
import { Objects } from '../src/Objects';
import { Types } from '../src/Types';

describe('Objects', () => {
  test('isObject', () => {
    expect(Objects.isObject(1)).toBe(false);
    expect(Objects.isObject(undefined)).toBe(false);
    expect(Objects.isObject(null)).toBe(false);
    expect(Objects.isObject(NaN)).toBe(false);
    expect(Objects.isObject('1')).toBe(false);
    expect(Objects.isObject([])).toBe(false);
    expect(Objects.isObject({})).toBe(true);
    expect(Objects.isObject(new Date())).toBe(true);
  });

  test('isFunction', () => {
    expect(Objects.isFunction(undefined)).toBe(false);
    expect(Objects.isFunction(null)).toBe(false);
    expect(Objects.isFunction(NaN)).toBe(false);
    expect(Objects.isFunction(() => {})).toBe(true);
    expect(Objects.isFunction(function () {})).toBe(true);
    expect(Objects.isFunction(new Function())).toBe(true);
  });

  test('isArray', () => {
    expect(Objects.isArray(undefined)).toBe(false);
    expect(Objects.isArray(null)).toBe(false);
    expect(Objects.isArray(NaN)).toBe(false);
    expect(Objects.isArray(1)).toBe(false);
    expect(Objects.isArray('Array')).toBe(false);
    expect(Objects.isArray('[]')).toBe(false);
    expect(Objects.isArray([])).toBe(true);
    expect(Objects.isArray(new Array())).toBe(true);
  });

  test('isString', () => {
    expect(Objects.isString(undefined)).toBe(false);
    expect(Objects.isString(null)).toBe(false);
    expect(Objects.isString(NaN)).toBe(false);
    expect(Objects.isString(1)).toBe(false);
    expect(Objects.isString('Array')).toBe(true);
    expect(Objects.isString('[]')).toBe(true);
    expect(Objects.isString('')).toBe(true);
    expect(Objects.isString('')).toBe(true);
    expect(Objects.isString(``)).toBe(true);
    expect(Objects.isString({})).toBe(false);
  });

  test('isNotNullOrUndefined', () => {
    expect(Objects.isNotNullOrUndefined(undefined)).toBe(false);
    expect(Objects.isNotNullOrUndefined(null)).toBe(false);
    expect(Objects.isNotNullOrUndefined(NaN)).toBe(true);
    expect(Objects.isNotNullOrUndefined(1)).toBe(true);
    expect(Objects.isNotNullOrUndefined('Array')).toBe(true);
    expect(Objects.isNotNullOrUndefined('[]')).toBe(true);
    expect(Objects.isNotNullOrUndefined('')).toBe(true);
    expect(Objects.isNotNullOrUndefined({})).toBe(true);
  });

  test('isNumeric', () => {
    expect(Objects.isNumeric(undefined)).toBe(false);
    expect(Objects.isNumeric(null)).toBe(false);
    expect(Objects.isNumeric(NaN)).toBe(false);
    expect(Objects.isNumeric('Array')).toBe(false);
    expect(Objects.isNumeric('[]')).toBe(false);
    expect(Objects.isNumeric('')).toBe(false);
    expect(Objects.isNumeric({})).toBe(false);
    expect(Objects.isNumeric(1)).toBe(true);
    expect(Objects.isNumeric(BigInt('1'))).toBe(true);
  });

  test('isBoolean', () => {
    expect(Objects.isBoolean(undefined)).toBe(false);
    expect(Objects.isBoolean(null)).toBe(false);
    expect(Objects.isBoolean(NaN)).toBe(false);
    expect(Objects.isBoolean('true')).toBe(false);
    expect(Objects.isBoolean({})).toBe(false);
    expect(Objects.isBoolean('')).toBe(false);
    expect(Objects.isBoolean(true)).toBe(true);
    expect(Objects.isBoolean(false)).toBe(true);
  });

  test('isPrimitive', () => {
    expect(Objects.isPrimitive(undefined)).toBe(true);
    expect(Objects.isPrimitive(null)).toBe(true);
    expect(Objects.isPrimitive(NaN)).toBe(true);
    expect(Objects.isPrimitive(1)).toBe(true);
    expect(Objects.isPrimitive('1')).toBe(true);
    expect(Objects.isPrimitive('true')).toBe(true);
    expect(Objects.isPrimitive(new String('true'))).toBe(false);
    expect(Objects.isPrimitive(Number(1))).toBe(true);
    expect(Objects.isPrimitive(true)).toBe(true);
    expect(Objects.isPrimitive(BigInt('1'))).toBe(true);
    expect(Objects.isPrimitive(Symbol('s'))).toBe(true);

    expect(Objects.isPrimitive({})).toBe(false);
    expect(Objects.isPrimitive([])).toBe(false);
    expect(Objects.isPrimitive(() => {})).toBe(false);
    expect(Objects.isPrimitive(new Function())).toBe(false);
  });

  test('forEach', () => {
    const spy = jest.fn();
    const obj = {
      field1: spy,
      field2: spy,
      field3: spy,
    };

    Objects.forEach(obj, (key, value) => {
      value();
    });

    expect(spy).toBeCalledTimes(3);
  });

  test('equals', () => {
    expect(Objects.equals({}, {})).toBe(true);
    expect(Objects.equals(1, 1)).toBe(true);
    expect(Objects.equals('1', '1')).toBe(true);
    expect(Objects.equals({ a: 1 }, { a: 1 })).toBe(true);
    expect(Objects.equals({ a: 1 }, { a: 2 })).toBe(false);
    expect(Objects.equals({ a: 1 }, { a: 1, b: 1 })).toBe(false);
    expect(Objects.equals({ a: 1, b: 1 }, { a: 1, b: 1 })).toBe(true);
    expect(Objects.equals({ a: 1, b: { c: 1 } }, { a: 1, b: { c: 1 } })).toBe(true);
    expect(Objects.equals({ a: 1, b: { c: 1 } }, { a: 1, b: { c: 2 } })).toBe(false);
  });

  test('equals with nulls', () => {
    expect(Objects.equals(undefined, undefined)).toBe(true);
    expect(Objects.equals(null, null)).toBe(true);
    expect(Objects.equals(null, undefined)).toBe(false);
    expect(Objects.equals(null, [])).toBe(false);
    expect(Objects.equals(undefined, [])).toBe(false);
  });

  test('equals with Date', () => {
    expect(Objects.equals({ a: new Date(1) }, { a: new Date(1) })).toBe(true);
    expect(Objects.equals({ a: new Date(1) }, { a: new Date(2) })).toBe(false);
  });

  test('equals with RegExp', () => {
    expect(Objects.equals({ a: new RegExp('test', 'i') }, { a: new RegExp('test', 'i') })).toBe(true);
    expect(Objects.equals({ a: new RegExp('test', 'i') }, { a: new RegExp('tett', 'i') })).toBe(false);
    expect(Objects.equals({ a: new RegExp('test', 'i') }, { a: new RegExp('test', 'g') })).toBe(false);
  });

  test('equals with Arrays', () => {
    expect(Objects.equals({ a: [1, 2, 3] }, { a: [1, 2, 3] })).toBe(true);
    expect(Objects.equals({ a: [1, 2, 3] }, { a: [3, 1, 2] })).toBe(false); // order matters
    expect(Objects.equals({ a: [1, 2, 3] }, { a: [3, 1] })).toBe(false);
    expect(Objects.equals({ a: [1, 2, 3] }, { a: [3, 4, 2] })).toBe(false);
  });

  test('deepCopy', () => {
    const src = {
      a: 1,
      b: {
        c: 2,
      },
    };
    const dst = Objects.deepCopy(src);
    expect(dst).toStrictEqual(src);
    expect(dst).not.toBe(src);
    expect(dst.b).not.toBe(src.b);
  });

  test('deepCopy with transfer', () => {
    const src = {
      a: 1,
      b: {
        c: 2,
      },
      fn: () => {},
    };
    const dst = Objects.deepCopy(src, true);
    expect(dst).toStrictEqual(src);
    expect(dst).not.toBe(src);
    expect(dst.b).not.toBe(src.b);
    expect(dst.fn).toBe(src.fn);
  });

  test('extend without transfer', () => {
    const src = {
      a: 1,
      b: {
        c: 2,
      },
      fn: () => {},
    };
    expect(() => Objects.deepCopy(src as Types.Serializable<typeof src>)).toThrow(Error);
  });

  test('extend', () => {
    let dst: Record<string, unknown> = { a: 1 };
    Objects.extend(dst, { a: 1 });
    expect(dst).toStrictEqual({ a: 1 });

    Objects.extend(dst, { a: 2 });
    expect(Objects.equals(dst, { a: 2 })).toBe(true);

    Objects.extend(dst, { b: 1 });
    expect(Objects.equals(dst, { a: 2, b: 1 })).toBe(true);

    Objects.extend(dst, { b: { c: 2 } });
    expect(Objects.equals(dst, { a: 2, b: { c: 2 } })).toBe(true);

    const fn = () => {};
    Objects.extend(dst, { b: fn });
    expect(dst.b).toBeDefined();
    expect(Objects.isFunction(dst.b)).toBe(true);
    expect(dst.b).toBe(fn);
  });

  test('extend with check', () => {
    let dst = { a: 1 };
    let changed = Objects.extend(
      dst,
      { a: 1 },
      { canOverwrite: (dst: any, src: any, key: any) => dst[key as unknown as keyof typeof dst] !== src[key] }
    );
    expect(changed).toBeFalsy();
    expect(dst).toStrictEqual({ a: 1 });

    changed = Objects.extend(
      dst,
      { a: 2 },
      { canOverwrite: (dst: any, src: any, key: any) => dst[key as unknown as keyof typeof dst] !== src[key] }
    );
    expect(changed).toBeTruthy();
    expect(dst).toStrictEqual({ a: 2 });

    dst = { a: 1 };
    changed = Objects.extend(
      dst,
      { b: 2 },
      { canOverwrite: (dst: any, src: any, key: any) => dst[key as unknown as keyof typeof dst] !== src[key] }
    );
    expect(changed).toBeTruthy();
    expect(dst).toStrictEqual({ a: 1, b: 2 });
  });

  test('isCharacterWhitespace', () => {
    expect(Objects.isCharacterWhitespace('s')).toBe(false);
    expect(Objects.isCharacterWhitespace(' ')).toBe(true);
    expect(Objects.isCharacterWhitespace(undefined!)).toBe(false);
    expect(Objects.isCharacterWhitespace('  ')).toBe(false);
  });

  test('isBlankString', () => {
    expect(Objects.isBlankString('')).toBe(true);
    expect(Objects.isBlankString(' ')).toBe(true);
    expect(Objects.isBlankString('  ')).toBe(true);
    expect(Objects.isBlankString('  \t  ')).toBe(true);
    expect(Objects.isBlankString('  \t  \r\n')).toBe(true);
    expect(Objects.isBlankString('g')).toBe(false);
  });

  test('isConstructorOf', () => {
    class Base {}

    class TestA {}

    class TestB extends Base {}

    class TestC extends TestB {}

    expect(Objects.isConstructorOf({}, Base)).toBe(false);
    expect(Objects.isConstructorOf('', Base)).toBe(false);
    expect(Objects.isConstructorOf(123, Base)).toBe(false);
    expect(Objects.isConstructorOf(() => {}, Base)).toBe(false);
    expect(Objects.isConstructorOf(TestA, Base)).toBe(false);
    expect(Objects.isConstructorOf(TestB, Base)).toBe(true);
    expect(Objects.isConstructorOf(TestC, Base)).toBe(true);
  });

  test('visit+flatten', () => {
    interface TreeItem {
      num: number;
      children?: TreeItem[];
    }

    const obj: TreeItem = {
      num: 100,
      children: [
        { num: 1 },
        { num: 2 },
        { num: 3, children: [{ num: 4 }, { num: 5 }, { num: 6, children: [{ num: 7 }] }] },
      ],
    };
    let result = 0;
    Objects.visit(obj, (obj) => {
      result += obj.num;
      return obj.children;
    });

    expect(result).toBe(128);

    result = 0;
    Objects.visit(obj, (obj, level) => {
      if (level <= 1) {
        result += obj.num;
        return obj.children;
      }
    });
    expect(result).toBe(106);

    const array = Objects.flatten(obj, (obj) => obj.children);
    expect(array).toHaveLength(8);
    expect(array.reduce((counter, obj2) => counter + obj2.num, 0)).toEqual(128);
  });

  describe('visit function', () => {
    interface TreeNode {
      id: string;
      value: number;
      children?: TreeNode[];
      parent?: TreeNode;
    }

    test('visits simple tree structure', () => {
      const tree: TreeNode = {
        id: 'root',
        value: 1,
        children: [
          { id: 'child1', value: 2 },
          { id: 'child2', value: 3, children: [{ id: 'grandchild', value: 4 }] },
        ],
      };

      const visited: string[] = [];
      const levels: number[] = [];

      Objects.visit(tree, (node, level) => {
        visited.push(node.id);
        levels.push(level);
        return node.children;
      });

      expect(visited).toEqual(['root', 'child1', 'child2', 'grandchild']);
      expect(levels).toEqual([0, 1, 1, 2]);
    });

    test('visits empty tree', () => {
      const tree: TreeNode = { id: 'lonely', value: 42 };
      const visited: string[] = [];

      Objects.visit(tree, (node, level) => {
        visited.push(node.id);
        return node.children;
      });

      expect(visited).toEqual(['lonely']);
    });

    test('stops visiting when visitor returns undefined', () => {
      const tree: TreeNode = {
        id: 'root',
        value: 1,
        children: [
          { id: 'child1', value: 2 },
          { id: 'child2', value: 3, children: [{ id: 'grandchild', value: 4 }] },
        ],
      };

      const visited: string[] = [];

      Objects.visit(tree, (node, level) => {
        visited.push(node.id);
        // Stop at level 1
        if (level >= 1) {
          return undefined;
        }
        return node.children;
      });

      expect(visited).toEqual(['root', 'child1', 'child2']);
    });

    test('handles circular references without infinite loop', () => {
      const parent: TreeNode = { id: 'parent', value: 1 };
      const child: TreeNode = { id: 'child', value: 2, parent: parent };
      parent.children = [child];

      const visited: string[] = [];

      Objects.visit(parent, (node, level) => {
        visited.push(node.id);

        const children: TreeNode[] = [];
        if (node.children) children.push(...node.children);
        if (node.parent) children.push(node.parent);

        return children.length > 0 ? children : undefined;
      });

      // The visit function should handle circular references internally
      // and prevent infinite loops
      expect(visited.length).toBeGreaterThan(0);
      expect(visited.length).toBeLessThan(100); // Should not loop infinitely
      expect(visited).toContain('parent');
      expect(visited).toContain('child');
    });

    test('handles complex circular references', () => {
      const nodeA: TreeNode = { id: 'A', value: 1 };
      const nodeB: TreeNode = { id: 'B', value: 2 };
      const nodeC: TreeNode = { id: 'C', value: 3 };

      // Create circular reference: A -> B -> C -> A
      nodeA.children = [nodeB];
      nodeB.children = [nodeC];
      nodeC.children = [nodeA];

      const visited: string[] = [];

      Objects.visit(nodeA, (node, level) => {
        visited.push(node.id);
        return node.children;
      });

      // The visit function should handle circular references internally
      expect(visited.length).toBeGreaterThan(0);
      expect(visited.length).toBeLessThan(100); // Should not loop infinitely
      expect(visited).toContain('A');
      expect(visited).toContain('B');
      expect(visited).toContain('C');
    });

    test('visits with different return patterns', () => {
      const tree: TreeNode = {
        id: 'root',
        value: 1,
        children: [
          { id: 'skip', value: 2, children: [{ id: 'skipped', value: 999 }] },
          { id: 'include', value: 3, children: [{ id: 'included', value: 4 }] },
        ],
      };

      const visited: string[] = [];

      Objects.visit(tree, (node, level) => {
        visited.push(node.id);

        // Skip children of 'skip' node
        if (node.id === 'skip') {
          return undefined;
        }

        return node.children;
      });

      expect(visited).toEqual(['root', 'skip', 'include', 'included']);
      expect(visited).not.toContain('skipped');
    });

    test('handles deep nesting levels', () => {
      // Create a deep tree: root -> level1 -> level2 -> ... -> level10
      let current: TreeNode = { id: 'level10', value: 10 };

      for (let i = 9; i >= 0; i--) {
        const parent: TreeNode = { id: `level${i}`, value: i, children: [current] };
        current = parent;
      }

      const visited: string[] = [];
      const levels: number[] = [];

      Objects.visit(current, (node, level) => {
        visited.push(node.id);
        levels.push(level);
        return node.children;
      });

      expect(visited).toHaveLength(11);
      expect(visited[0]).toBe('level0');
      expect(visited[10]).toBe('level10');
      expect(levels).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    test('visitor can modify visited object', () => {
      const tree: TreeNode = {
        id: 'root',
        value: 1,
        children: [{ id: 'child', value: 2 }],
      };

      const visited: number[] = [];

      Objects.visit(tree, (node, level) => {
        visited.push(node.value);
        node.value *= 2; // Modify the node
        return node.children;
      });

      expect(visited).toEqual([1, 2]);
      expect(tree.value).toBe(2);
      expect(tree.children![0].value).toBe(4);
    });

    test('handles null and undefined children arrays', () => {
      const tree: TreeNode = {
        id: 'root',
        value: 1,
        children: [
          { id: 'child1', value: 2, children: undefined },
          { id: 'child2', value: 3, children: [] },
          { id: 'child3', value: 4 }, // no children property
        ],
      };

      const visited: string[] = [];

      Objects.visit(tree, (node, level) => {
        visited.push(node.id);
        return node.children?.length ? node.children : undefined;
      });

      expect(visited).toEqual(['root', 'child1', 'child2', 'child3']);
    });
  });

  describe('deepFreeze', () => {
    test('should freeze primitive values', () => {
      expect(Objects.deepFreeze(42)).toBe(42);
      expect(Objects.deepFreeze('hello')).toBe('hello');
      expect(Objects.deepFreeze(true)).toBe(true);
      expect(Objects.deepFreeze(null)).toBe(null);
      expect(Objects.deepFreeze(undefined)).toBe(undefined);
    });

    test('should freeze simple objects', () => {
      const obj = { a: 1, b: 'test' };
      const frozen = Objects.deepFreeze(obj);

      expect(Object.isFrozen(frozen)).toBe(true);
      expect(frozen).toBe(obj); // Same reference
      expect(() => {
        (frozen as any).a = 999;
      }).toThrow();
    });

    test('should recursively freeze nested objects', () => {
      const obj = {
        level1: {
          level2: {
            value: 'deep',
          },
          array: [1, 2, { nested: true }],
        },
      };

      const frozen = Objects.deepFreeze(obj);

      expect(Object.isFrozen(frozen)).toBe(true);
      expect(Object.isFrozen(frozen.level1)).toBe(true);
      expect(Object.isFrozen(frozen.level1.level2)).toBe(true);
      expect(Object.isFrozen(frozen.level1.array)).toBe(true);
      expect(Object.isFrozen(frozen.level1.array[2])).toBe(true);
    });

    test('should freeze arrays and their elements', () => {
      const arr = [1, { nested: 'object' }, [2, 3, { deep: true }]];
      const frozen = Objects.deepFreeze(arr);

      expect(Object.isFrozen(frozen)).toBe(true);
      expect(Object.isFrozen(frozen[1])).toBe(true);
      expect(Object.isFrozen(frozen[2])).toBe(true);
      expect(Object.isFrozen((frozen[2] as any)[2])).toBe(true);

      expect(() => {
        (frozen as any).push(4);
      }).toThrow();

      expect(() => {
        (frozen[1] as any).nested = 'changed';
      }).toThrow();
    });

    test('should handle circular references without infinite recursion', () => {
      const obj: any = { name: 'parent' };
      obj.self = obj; // Circular reference

      expect(() => Objects.deepFreeze(obj)).not.toThrow();
      expect(Object.isFrozen(obj)).toBe(true);
    });

    test('should handle already frozen objects', () => {
      const obj = { value: 123, nested: { prop: 'test' } };
      Object.freeze(obj);

      const result = Objects.deepFreeze(obj);
      expect(result).toBe(obj);
      expect(Object.isFrozen(result)).toBe(true);
      expect(Object.isFrozen(result.nested)).toBe(true);
    });

    test('should return correct TypeScript type', () => {
      const obj = { mutable: 'value', nested: { prop: 42 } };
      const frozen = Objects.deepFreeze(obj);

      // TypeScript should treat this as DeepReadonly
      // This test verifies the return type is correct
      expect(frozen.mutable).toBe('value');
      expect(frozen.nested.prop).toBe(42);
    });

    test('should handle Date objects', () => {
      const date = new Date('2023-01-01');
      const obj = { timestamp: date };

      const frozen = Objects.deepFreeze(obj);

      expect(Object.isFrozen(frozen)).toBe(true);
      expect(Object.isFrozen(frozen.timestamp)).toBe(true);
      expect(frozen.timestamp.getTime()).toBe(date.getTime());
    });

    test('should handle mixed nested structures', () => {
      const complex = {
        users: [
          { id: 1, profile: { name: 'Alice', settings: { theme: 'dark' } } },
          { id: 2, profile: { name: 'Bob', settings: { theme: 'light' } } },
        ],
        config: {
          api: { url: 'https://api.example.com', timeout: 5000 },
          features: ['auth', 'notifications'],
        },
      };

      const frozen = Objects.deepFreeze(complex);

      // Check all levels are frozen
      expect(Object.isFrozen(frozen)).toBe(true);
      expect(Object.isFrozen(frozen.users)).toBe(true);
      expect(Object.isFrozen(frozen.users[0])).toBe(true);
      expect(Object.isFrozen(frozen.users[0].profile)).toBe(true);
      expect(Object.isFrozen(frozen.users[0].profile.settings)).toBe(true);
      expect(Object.isFrozen(frozen.config)).toBe(true);
      expect(Object.isFrozen(frozen.config.api)).toBe(true);
      expect(Object.isFrozen(frozen.config.features)).toBe(true);

      // Verify mutations throw errors
      expect(() => {
        (frozen.users[0].profile as any).name = 'Charlie';
      }).toThrow();

      expect(() => {
        (frozen.config.features as any).push('newFeature');
      }).toThrow();
    });
  });
});
