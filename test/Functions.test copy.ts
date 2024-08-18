import { Functions } from '../src/Functions';
import {describe, expect, test, jest} from '@jest/globals';


describe("Functions", () => {
  test("identity", () => {
    expect(Functions.identity(1)()).toBe(1);
    expect(Functions.identity(undefined)()).toBe(undefined);
  });

  test("compose", () => {
    const fn : Functions.MapFunction<string, string> = Functions.compose((str) => {
      return str + "f1";
    }, (str) => {
      return str + "f2";
    })

    expect(fn("text")).toBe("textf1f2");
  });


  test("join", () => {
    const f1 = jest.fn();
    const f2 = jest.fn();
    const fn : Functions.Consumer<void> = Functions.join(f1, f2);

    fn();

    expect(f1).toBeCalledTimes(1);
    expect(f2).toBeCalledTimes(1);
  });
});
