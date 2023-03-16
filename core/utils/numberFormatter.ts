import Big from "big.js";

export const ParseDecimal = (amount: string, decimal: number) => {
  return Big(amount).mul(Big(10).pow(decimal)).toFixed(0, Big.roundDown);
};

// this enables writing "0.0", while as using Big() doesn't.
export const trimUnderNegativeExponent = (
  rawInput: string,
  negativeExponent: number,
) => {
  const precisionRegex = new RegExp(`\\d+(\\.\\d{0,${negativeExponent}})?`);
  return rawInput.match(precisionRegex)?.[0] || "";
};

export const trimTrailingZeros = (rawInput: string) => {
  const trimRegex = new RegExp(/(((?<=(\.|,)\d*?[1-9])0+$)|(\.|,)0+$)/);
  return rawInput.replace(trimRegex, "");
};

export const convertBigToFixedString = (
  inputBig: Big,
  negativeExponent: number,
) => {
  return trimTrailingZeros(inputBig.toFixed(negativeExponent, Big.roundDown));
};

export const convertBigToPrecisionString = (
  inputBig: Big,
  negativeExponent: number,
) => {
  return trimTrailingZeros(
    inputBig.toPrecision(negativeExponent, Big.roundDown),
  );
};
