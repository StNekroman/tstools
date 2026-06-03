import { describe, expect, test } from "@jest/globals";
import { Strings } from "../src/Strings";

describe("Strings", () => {
  describe("damerauLevenshtein", () => {
    test("identical strings have distance 0", () => {
      expect(Strings.damerauLevenshtein("", "")).toBe(0);
      expect(Strings.damerauLevenshtein("abc", "abc")).toBe(0);
    });

    test("empty string distance equals the other string's length", () => {
      expect(Strings.damerauLevenshtein("", "abc")).toBe(3);
      expect(Strings.damerauLevenshtein("abc", "")).toBe(3);
    });

    test("single substitution", () => {
      expect(Strings.damerauLevenshtein("cat", "bat")).toBe(1);
    });

    test("single insertion", () => {
      expect(Strings.damerauLevenshtein("cat", "cats")).toBe(1);
    });

    test("single deletion", () => {
      expect(Strings.damerauLevenshtein("cats", "cat")).toBe(1);
    });

    test("adjacent transposition counts as a single edit", () => {
      // the documented motivating case: form <-> from
      expect(Strings.damerauLevenshtein("form", "from")).toBe(1);
      expect(Strings.damerauLevenshtein("ab", "ba")).toBe(1);
    });

    test("classic multi-edit examples", () => {
      expect(Strings.damerauLevenshtein("kitten", "sitting")).toBe(3);
      expect(Strings.damerauLevenshtein("Saturday", "Sunday")).toBe(3);
    });

    test("is case sensitive", () => {
      expect(Strings.damerauLevenshtein("Cat", "cat")).toBe(1);
    });

    test("is symmetric", () => {
      expect(Strings.damerauLevenshtein("kitten", "sitting")).toBe(
        Strings.damerauLevenshtein("sitting", "kitten")
      );
      expect(Strings.damerauLevenshtein("form", "from")).toBe(
        Strings.damerauLevenshtein("from", "form")
      );
    });
  });

  describe("closestMatch", () => {
    test("returns undefined for empty candidates", () => {
      expect(Strings.closestMatch("foo", [])).toBeUndefined();
    });

    test("returns an exact match", () => {
      expect(Strings.closestMatch("foo", ["bar", "foo", "baz"])).toBe("foo");
    });

    test("returns the closest typo correction within threshold", () => {
      expect(Strings.closestMatch("form", ["from", "data", "name"])).toBe("from");
      expect(Strings.closestMatch("usrName", ["userName", "userId", "firstName"])).toBe("userName");
    });

    test("picks the minimum-distance candidate regardless of order", () => {
      expect(Strings.closestMatch("cat", ["xxxx", "bat"])).toBe("bat");
    });

    test("on ties returns the first candidate with the minimum distance", () => {
      // "cat" is distance 1 from both "bat" and "hat"; first one wins
      expect(Strings.closestMatch("cat", ["bat", "hat"])).toBe("bat");
    });

    test("returns undefined when nothing is within threshold", () => {
      // target length 3 -> threshold max(3, 1) = 3; distance 6 is too far
      expect(Strings.closestMatch("abc", ["xyzwuv"])).toBeUndefined();
    });

    test("threshold scales with target length (floor(length / 2))", () => {
      // target length 10 -> threshold max(3, 5) = 5
      expect(Strings.closestMatch("abcdefghij", ["abcde"])).toBe("abcde"); // distance 5, included
      expect(Strings.closestMatch("abcdefghij", ["abcd"])).toBeUndefined(); // distance 6, excluded
    });

    test("short targets still allow up to the minimum threshold of 3", () => {
      // target length 1 -> threshold max(3, 0) = 3, so distance up to 3 is accepted
      expect(Strings.closestMatch("a", ["abcd"])).toBe("abcd"); // distance 3, included
      expect(Strings.closestMatch("a", ["abcde"])).toBeUndefined(); // distance 4, excluded
    });
  });
});
