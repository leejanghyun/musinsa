import { throttle } from "@/utills/utills";

export function Throttle(milli: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const val = descriptor.value;
    descriptor.value = throttle(function(...args: any) {
      val.apply(this, args);
    }, milli);
    return descriptor;
  };
}