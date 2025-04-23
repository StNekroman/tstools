export type TypedPropertyDecorator<C> = (target: C, propertyKey: keyof C | string | symbol) => void;
export type TypedMethodDecorator<C> = <T>(
  target: C,
  propertyKey: keyof C | string | symbol,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void;
export type TypedParameterDecorator<C> = (
  target: C,
  propertyKey: keyof C | string | symbol | undefined,
  parameterIndex: number
) => void;
