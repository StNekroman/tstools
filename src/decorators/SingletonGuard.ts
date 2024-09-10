import { Types } from '../Types';

export class SingletonGuardError extends Error {}

export function SingletonGuard<C>() {
  let instanceRefCount = 0;

  return (ctr: Types.Newable<C>) : Types.Newable<C> => {
    function newConstructor(...args: unknown[]) {
      if (++instanceRefCount > 1) {
        throw new SingletonGuardError(`SingletonGuard: class ${ctr} cannot have more then one instance`);
      }
    
      // Call the original constructor with validated arguments
      return new ctr(...args);
    }

    newConstructor.prototype = ctr.prototype;
    return newConstructor as unknown as Types.Newable<C>;
  }; 
}
