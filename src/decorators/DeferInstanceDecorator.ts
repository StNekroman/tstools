import { type Types } from '../Types';

interface DeferInstanceDecoratorsMetadata<C extends Object> {
  decorators: [propertyName: keyof C | string, decorator: PropertyDecorator | MethodDecorator][];
}

const DeferInstanceDecoratorsMetadataSymbol = Symbol('DeferInstanceDecoratorsMetadata');
function getDeferInstanceDecoratorsMetadata<C extends Object>(
  target: any
): DeferInstanceDecoratorsMetadata<C> | undefined {
  if (target.hasOwnProperty(DeferInstanceDecoratorsMetadataSymbol)) {
    return target[DeferInstanceDecoratorsMetadataSymbol];
  }
  return undefined;
}
function getOrCreateDeferInstanceDecoratorsMetadata<C extends Object>(target: any): DeferInstanceDecoratorsMetadata<C> {
  let metadata: DeferInstanceDecoratorsMetadata<C>;
  if (target.hasOwnProperty(DeferInstanceDecoratorsMetadataSymbol)) {
    metadata = target[DeferInstanceDecoratorsMetadataSymbol];
  } else {
    metadata = {
      decorators: [],
    };
    Object.defineProperty(target, DeferInstanceDecoratorsMetadataSymbol, {
      value: metadata,
    });
  }
  return metadata as DeferInstanceDecoratorsMetadata<C>;
}

export function applyInstanceDecorators<C extends Object, CTR extends Types.Newable<C> | { prototype: unknown }>(
  instance: C,
  ctr: CTR,
  metadata: DeferInstanceDecoratorsMetadata<C> | undefined = getDeferInstanceDecoratorsMetadata<C>(ctr.prototype)
): void {
  if (metadata) {
    for (const [propertyName, decorator] of metadata.decorators) {
      decorator(instance, propertyName as string, Object.getOwnPropertyDescriptor(instance, propertyName)!);
    }
  }
}

export function RunInstanceDecorators<C extends Object>() {
  return <CTR extends Types.Newable<C> | { prototype: unknown }>(ctr: CTR): CTR => {
    const metadata: DeferInstanceDecoratorsMetadata<C> | undefined = getDeferInstanceDecoratorsMetadata<C>(
      ctr.prototype
    );
    if (!metadata) {
      return ctr;
    }
    const newCtr = class extends (ctr as Types.Newable) {
      constructor(...args: unknown[]) {
        super(...args);
        applyInstanceDecorators(this as unknown as C, ctr, metadata);
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
