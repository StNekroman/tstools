import { Functions } from "../../src";


// join functions in chain/pipe, so result from previous will be passed as input to next function
const piped = Functions.pipe((a: number) => a + 1)  // start fromt this
                       .pipe((a: number) => a % 2 === 0 ? true : false) // then do this
                       .pipe((flag: boolean) => flag ? "textTrue" : "textFalse"); // then - that

piped satisfies (_a: number) => string;
piped satisfies Functions.ArgsFunction<[number], string>;
piped satisfies Functions.PipedFunction<Functions.ArgsFunction<[number], string>>;

// or array of mappers in one pipe() call
const _piped2 = Functions.pipe( // eslint-disable-line @typescript-eslint/no-unused-vars
  (a: number) => a + 1,
  a => a % 2 === 0 ? true : false,
  flag => flag ? "textTrue" : "textFalse"
); // all types are auto-determined


// Next commented code block will give you an TS compilation error, as second passed function (with boolean flag arg) cannot be piped to previous.
// It accepts different input type from previos function return type.
/*
Functions.pipe(
  (a: number) => a + 1,
  (flag: boolean) => flag ? "textTrue" : "textFalse"
);
*/

// But (due to current temporary limitations of TypeScript pre-proceessor) type guards defined in array version will work only up to 3 arguments
// on more arguments - any-typing brings to play, so it's recommended to define final piped function type manually, without auto-determination.