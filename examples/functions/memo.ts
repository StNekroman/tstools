import { Functions } from '../../src/Functions';


const realFunction = (a: string, b: number) : string => {
  // heavy logic here
  return a + b;
};

const memoized : Functions.MemoizedFunction<typeof realFunction> = Functions.memo(realFunction);
// or just
// const memoized = Functions.memo(realFunction);

memoized("str", 1); // realFunction called once
memoized("str", 1); // result already cached
memoized("str", 2); // new arguments - new call to realFunction

memoized.clear(); // drops all from internal memo cache

memoized("str", 1); // again call to realFunction, as previous data dropeed
memoized("str", 1); // already cached
