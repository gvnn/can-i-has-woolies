// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const nonNegativeInteger = (input: any): number => {
  if (input === null || typeof input === "undefined") {
    throw Error(`not a non-negative integer: '${input}'`);
  }

  if (!input || input.length === 0) {
    throw Error(`not a non-negative integer: '${input}'`);
  }

  const parsed = Number(input);

  if (parsed > 0 && Number.isSafeInteger(parsed)) {
    return parsed;
  }

  throw Error(`not a non-negative integer: '${input}'`);
};
