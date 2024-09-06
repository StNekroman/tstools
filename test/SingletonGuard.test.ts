import { describe, expect, test } from "@jest/globals";
import { SingletonGuard, SingletonGuardError } from "../src";

describe("GroupBy", () => {

  class BaseTestClass {
    constructor(public readonly a: string, public readonly b: string) {}
  }

  test("shortcut version", () => {

    @SingletonGuard()
    class TestClass extends BaseTestClass {}

    const instance1 : TestClass = new TestClass("aval", "bval");
    expect(instance1).toBeDefined();
    expect(instance1.a).toBe("aval");
    expect(instance1.b).toBe("bval");

    expect(() => new TestClass("aval", "bval")).toThrow(SingletonGuardError);
  });
});
