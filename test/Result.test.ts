import { describe, expect, test } from '@jest/globals';
import { Failure, FailureData, Result, Success, SuccessData } from '../src/Result';

describe('Result', () => {
  describe('Static factory methods', () => {
    test('success creates Success result', () => {
      const result = Result.success('test data');
      expect(result.isSuccess()).toBeTruthy();
      expect(result.isFailure()).toBeFalsy();
      expect(result.data).toBe('test data');
    });

    test('success with void data', () => {
      const result = Result.success();
      expect(result.isSuccess()).toBeTruthy();
      expect(result.isFailure()).toBeFalsy();
      expect(result.data).toBeUndefined();
    });

    test('failure creates Failure result', () => {
      const result = Result.failure('error message');
      expect(result.isFailure()).toBeTruthy();
      expect(result.isSuccess()).toBeFalsy();
      expect(result.error).toBe('error message');
    });
  });

  describe('Type guards', () => {
    test('isSuccess correctly identifies success results', () => {
      const success = Result.success(42);
      const failure = Result.failure('error');

      expect(success.isSuccess()).toBeTruthy();
      expect(failure.isSuccess()).toBeFalsy();
    });

    test('isFailure correctly identifies failure results', () => {
      const success = Result.success(42);
      const failure = Result.failure('error');

      expect(failure.isFailure()).toBeTruthy();
      expect(success.isFailure()).toBeFalsy();
    });
  });

  describe('Data and error getters', () => {
    test('getData returns data from success result', () => {
      const result = Result.success('test data');
      expect(result.data).toBe('test data');
    });

    test('getError returns error from failure result', () => {
      const result = Result.failure('test error');
      expect(result.error).toBe('test error');
    });
  });

  describe('Functional operations', () => {
    test('map transforms success data', () => {
      const result = Result.success(5);
      const mapped = result.map((x) => x * 2);

      expect(mapped.isSuccess()).toBeTruthy();
      expect(mapped.data).toBe(10);
    });

    test('map does not affect failure', () => {
      const result = Result.failure('error');
      const mapped = result.map((x) => x * 2);

      expect(mapped.isFailure()).toBeTruthy();
      expect(mapped.error).toBe('error');
    });

    test('flatMap chains successful operations', () => {
      const result = Result.success(5);
      const flatMapped = result.flatMap((x) => Result.success(x * 2));

      expect(flatMapped.isSuccess()).toBeTruthy();
      expect(flatMapped.data).toBe(10);
    });

    test('flatMap can return failure', () => {
      const result = Result.success(5);
      const flatMapped = result.flatMap((x) => Result.failure<string>('operation failed'));

      expect(flatMapped.isFailure()).toBeTruthy();
      expect(flatMapped.error).toBe('operation failed');
    });

    test('flatMap does not affect failure', () => {
      const result = Result.failure('original error');
      const flatMapped = result.flatMap((x) => Result.success(x * 2));

      expect(flatMapped.isFailure()).toBeTruthy();
      expect(flatMapped.error).toBe('original error');
    });
  });

  describe('Serialization', () => {
    test('toJSON serializes success result', () => {
      const result = Result.success({ key: 'value' });
      const json = result.toJSON();

      expect(json).toEqual({
        data: { key: 'value' },
        error: undefined,
      });
    });

    test('toJSON serializes failure result', () => {
      const result = Result.failure({ message: 'error' });
      const json = result.toJSON();

      expect(json).toEqual({
        data: undefined,
        error: { message: 'error' },
      });
    });

    test('toString returns JSON string', () => {
      const result = Result.success('test');
      const str = result.toString();

      expect(str).toBe(JSON.stringify({ data: 'test', error: undefined }));
    });
  });

  describe('Result.from deserialization', () => {
    test('from creates success from SuccessData', () => {
      const successData: SuccessData<string> = { data: 'test data' };
      const result = Result.from(successData);

      expect(result.isSuccess()).toBeTruthy();
      expect(result.data).toBe('test data');
    });

    test('from creates failure from FailureData', () => {
      const failureData: FailureData<string> = { error: 'test error' };
      const result = Result.from(failureData);

      expect(result.isFailure()).toBeTruthy();
      expect(result.error).toBe('test error');
    });

    test('from throws error for invalid data', () => {
      const invalidData = {} as any;
      expect(() => Result.from(invalidData)).toThrow('Invalid Result type');
    });
  });

  describe('Success and Failure namespace utilities', () => {
    test('Success.isSuccessData identifies success data', () => {
      const successData: SuccessData<string> = { data: 'test' };
      const failureData: FailureData<string> = { error: 'error' };

      expect(Success.isSuccessData(successData)).toBeTruthy();
      expect(Success.isSuccessData(failureData)).toBeFalsy();
    });

    test('Failure.isFailureData identifies failure data', () => {
      const successData: SuccessData<string> = { data: 'test' };
      const failureData: FailureData<string> = { error: 'error' };

      expect(Failure.isFailureData(failureData)).toBeTruthy();
      expect(Failure.isFailureData(successData)).toBeFalsy();
    });

    test('Success.isSuccessData over Result instances', () => {
      expect(Success.isSuccessData(Result.success('test'))).toBeTruthy();
      expect(Failure.isFailureData(Result.failure('error'))).toBeTruthy();
      expect(Failure.isFailureData(Result.success('test'))).toBeFalsy();
      expect(Success.isSuccessData(Result.failure('error'))).toBeFalsy();
    });
  });

  describe('Result.groupResults', () => {
    test('groups mixed results correctly', () => {
      const results = [
        Result.success('data1'),
        Result.failure('error1'),
        Result.success('data2'),
        Result.failure('error2'),
        Result.success('data3'),
      ];

      const grouped = Result.groupResults(results);

      expect(grouped.successes).toHaveLength(3);
      expect(grouped.failures).toHaveLength(2);

      expect(grouped.successes[0].data).toBe('data1');
      expect(grouped.successes[1].data).toBe('data2');
      expect(grouped.successes[2].data).toBe('data3');

      expect(grouped.failures[0].error).toBe('error1');
      expect(grouped.failures[1].error).toBe('error2');
    });

    test('groups all successes', () => {
      const results = [Result.success('data1'), Result.success('data2'), Result.success('data3')];

      const grouped = Result.groupResults(results);

      expect(grouped.successes).toHaveLength(3);
      expect(grouped.failures).toHaveLength(0);
    });

    test('groups all failures', () => {
      const results = [Result.failure('error1'), Result.failure('error2'), Result.failure('error3')];

      const grouped = Result.groupResults(results);

      expect(grouped.successes).toHaveLength(0);
      expect(grouped.failures).toHaveLength(3);
    });

    test('handles empty array', () => {
      const results: Result<string, string>[] = [];
      const grouped = Result.groupResults(results);

      expect(grouped.successes).toHaveLength(0);
      expect(grouped.failures).toHaveLength(0);
    });
  });

  describe('Complex data types', () => {
    test('works with object data', () => {
      const data = { id: 1, name: 'test', active: true };
      const result = Result.success(data);

      expect(result.data).toEqual(data);
    });

    test('works with array data', () => {
      const data = [1, 2, 3, 4, 5];
      const result = Result.success(data);

      expect(result.data).toEqual(data);
    });

    test('works with nested objects', () => {
      const data = {
        user: { id: 1, profile: { name: 'John', settings: { theme: 'dark' } } },
        items: [
          { id: 1, value: 'a' },
          { id: 2, value: 'b' },
        ],
      };
      const result = Result.success(data);

      expect(result.data).toEqual(data);
    });
  });

  describe('Chaining operations', () => {
    test('chains multiple map operations', () => {
      const result = Result.success(5)
        .map((x) => x * 2)
        .map((x) => x + 1)
        .map((x) => x.toString());

      expect(result.data).toBe('11');
    });

    test('chains map and flatMap operations', () => {
      const result = Result.success(5)
        .map((x) => x * 2)
        .flatMap((x) => Result.success(x + 1))
        .map((x) => x.toString());

      expect(result.data).toBe('11');
    });

    test('chain breaks on first failure', () => {
      const result = Result.success(5)
        .map((x) => x * 2)
        .flatMap((x) => Result.failure('error in chain'))
        .map((x) => x + 1); // This should not execute

      expect(result.isFailure()).toBeTruthy();
      expect(result.error).toBe('error in chain');
    });
  });
});
