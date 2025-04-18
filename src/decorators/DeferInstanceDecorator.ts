import { type Types } from '../Types';

interface DeferInstanceDecoratorsMetadata<C extends Object> {
  decorators: [propertyName: keyof C | string, decorator: PropertyDecorator | MethodDecorator][];
}

const DeferInstanceDecoratorsMetadataSymbol = Symbol('DeferInstanceDecoratorsMetadata');
function getDeferInstanceDecoratorsMetadata<C extends Object>(prototype: any): DeferInstanceDecoratorsMetadata<C> {
  return prototype[DeferInstanceDecoratorsMetadataSymbol];
}
function getOrCreateDeferInstanceDecoratorsMetadata<C extends Object>(
  prototype: any
): DeferInstanceDecoratorsMetadata<C> {
  const metadata: DeferInstanceDecoratorsMetadata<C> =
    prototype[DeferInstanceDecoratorsMetadataSymbol] ??
    (prototype[DeferInstanceDecoratorsMetadataSymbol] = {
      decorators: [],
    } as DeferInstanceDecoratorsMetadata<C>);
  return metadata as DeferInstanceDecoratorsMetadata<C>;
}

export function applyInstanceDecorators<C extends Object>(
  instance: C,
  metadata: DeferInstanceDecoratorsMetadata<C> = getDeferInstanceDecoratorsMetadata<C>(instance.constructor.prototype)
): void {
  if (metadata) {
    for (const [propertyName, decorator] of metadata.decorators) {
      decorator(instance, propertyName as string, Object.getOwnPropertyDescriptor(instance, propertyName)!);
    }
  }
}

export function RunInstanceDecorators<C extends Object>() {
  return <CTR extends Types.Newable<C> | { prototype: C }>(ctr: CTR): CTR => {
    const metadata: DeferInstanceDecoratorsMetadata<C> = getDeferInstanceDecoratorsMetadata<C>(ctr.prototype);
    if (!metadata) {
      return ctr;
    }
    const newCtr = class extends (ctr as Types.Newable) {
      constructor(...args: unknown[]) {
        super(...args);
        applyInstanceDecorators(this as unknown as C, metadata);
      }
    } as CTR;
    Object.defineProperty(newCtr, 'name', { value: (ctr as Types.Newable<C>).name });
    return newCtr;
  };
}

export function DeferInstanceDecorator<C extends Object>(decorator: PropertyDecorator | MethodDecorator) {
  return (target: C, propertyName: keyof C | string) => {
    const metadata: DeferInstanceDecoratorsMetadata<C> = getOrCreateDeferInstanceDecoratorsMetadata<C>(target);
    metadata.decorators.push([propertyName, decorator]);
  };
}
