import { format as formatBytes } from "@std/fmt/bytes";
import { format as formatMillis } from "@std/fmt/duration";

export const throwError = (message: string): never => {
  throw new Error(message);
};

export const mapRange = <T>(length: number, callback: (index: number) => T): T[] => {
  return [...Array(length).keys()].map(callback);
};

export const Log = {
  // deno-lint-ignore no-explicit-any
  debug(...data: any[]) {
    console.debug(...data);
  },

  // deno-lint-ignore no-explicit-any
  error(...data: any[]) {
    console.error(...data);
  },
};

export const Json = {
  // deno-lint-ignore no-explicit-any
  write(text: any, space: number = 2): string {
    return JSON.stringify(text, null, space);
  },

  read(text: string): string {
    return JSON.parse(text);
  },
};

export const Fmt = {
  bytes(bytes: number): string {
    return formatBytes(bytes);
  },

  millis(
    millis: number,
    roundTo: "millis" | "micros" | "nanos" = "micros",
  ): string {
    if (roundTo === "millis") {
      millis = Math.round(millis);
    } else if (roundTo === "micros") {
      millis = Math.round(millis * 1e3) / 1e3;
    }
    return millis === 0 ? "0ms" : formatMillis(millis, { ignoreZero: true });
  },

  millisDiff(
    startTime: number,
    stopTime: number,
    roundTo: "millis" | "micros" | "nanos" = "micros",
  ): string {
    return Fmt.millis(stopTime - startTime, roundTo);
  },
};

export const Rand = {
  number(lowerLimit: number, upperLimit: number, rand = Math.random): number {
    return lowerLimit + Math.floor(rand() * (upperLimit - lowerLimit + 1));
  },

  item<T>(items: T[], rand = Math.random) {
    const index = Rand.number(0, items.length - 1, rand);
    return items[index];
  },

  char(rand = Math.random): string {
    const lowerLimit = "a".charCodeAt(0);
    const upperLimit = "z".charCodeAt(0);
    const index = Rand.number(lowerLimit, upperLimit, rand);
    return String.fromCharCode(index);
  },

  string(length: number, rand = Math.random): string {
    return mapRange(length, () => Rand.char(rand)).join("");
  },
};
