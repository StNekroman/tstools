import { type Types } from '../Types';

interface DeferInstanceDecoratorsMetadata<C> {
  decorators: [propertyName: keyof C | string, decorator: PropertyDecorator | MethodDecorator][];
}

const DeferInstanceDecoratorsMetadataSymbol = Symbol('DeferInstanceDecoratorsMetadata');
function getDeferInstanceDecoratorsMetadata<C>(prototype: any): DeferInstanceDecoratorsMetadata<C> {
  return prototype[DeferInstanceDecoratorsMetadataSymbol];
}
function getOrCreateDeferInstanceDecoratorsMetadata<C>(prototype: any): DeferInstanceDecoratorsMetadata<C> {
  const metadata: DeferInstanceDecoratorsMetadata<unknown> =
    prototype[DeferInstanceDecoratorsMetadataSymbol] ??
    (prototype[DeferInstanceDecoratorsMetadataSymbol] = {
      decorators: [],
    } as DeferInstanceDecoratorsMetadata<C>);
  return metadata as DeferInstanceDecoratorsMetadata<C>;
}

export function RunInstanceDecorators<C>() {
  return <CTR extends Types.Newable<C>>(ctr: CTR): CTR => {
    const metadata: DeferInstanceDecoratorsMetadata<C> = getDeferInstanceDecoratorsMetadata<C>(ctr.prototype);
    if (!metadata) {
      return ctr;
    }
    ctr = class extends (ctr as Types.Newable) {
      constructor() {
        super();

        for (const [propertyName, decorator] of metadata.decorators) {
          decorator(this, propertyName as string, Object.getOwnPropertyDescriptor(this, propertyName)!);
        }
      }
    } as CTR;

    return ctr;
  };
}

export function DeferInstanceDecorator<C>(decorator: PropertyDecorator | MethodDecorator) {
  return (target: C, propertyName: keyof C | string) => {
    const metadata: DeferInstanceDecoratorsMetadata<C> = getOrCreateDeferInstanceDecoratorsMetadata<C>(target);
    metadata.decorators.push([propertyName, decorator]);
  };
}
