import debounce from 'lodash/debounce'

export function Debounce (duration: number) {
  return (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
    const targetFn = descriptor.value;
    descriptor.value = debounce.apply(target, [ targetFn, duration ]);
  }
}