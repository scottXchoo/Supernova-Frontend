import Big from "big.js";
import {
  trimUnderNegativeExponent,
  trimTrailingZeros,
} from "core/utils/numberFormatter";
import React, { useCallback, useEffect, useMemo, useState } from "react";

interface InputProps {
  negativeExponent: number;
  max: string;
  min?: string;
  placeholder?: string;
}

const useInput = ({
  negativeExponent,
  max: _max,
  min: _min = "0",
  placeholder = "0",
}: InputProps) => {
  const [rawInput, setRawInput] = useState("");
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const max = useMemo(
    () => trimTrailingZeros(trimUnderNegativeExponent(_max, negativeExponent)),
    [_max, negativeExponent],
  );
  const min = useMemo(
    () => trimTrailingZeros(trimUnderNegativeExponent(_min, negativeExponent)),
    [_min, negativeExponent],
  );
  const half = useMemo(
    () =>
      trimTrailingZeros(
        Big(_max).div(2).toFixed(negativeExponent, Big.roundDown),
      ),
    [_max, negativeExponent],
  );

  const isMax = useMemo(() => {
    return Big(max).eq(input || placeholder);
  }, [max, input, placeholder]);
  const isMin = useMemo(() => {
    return Big(min).eq(input || placeholder);
  }, [min, input, placeholder]);
  const isHalf = useMemo(() => {
    return Big(half).eq(input || placeholder);
  }, [half, input, placeholder]);

  const isOverMax = useMemo(() => {
    return Big(input || placeholder).gt(max);
  }, [input, max, placeholder]);

  const toggleMax = useCallback(() => {
    if (isMax) {
      setInput(rawInput);
    } else {
      setInput(max);
    }
  }, [isMax, max, rawInput]);
  const toggleMin = useCallback(() => {
    if (isMin) {
      setInput(rawInput);
    } else {
      setInput(min);
    }
  }, [isMin, min, rawInput]);
  const toggleHalf = useCallback(() => {
    if (isHalf) {
      setInput(rawInput);
    } else {
      setInput(half);
    }
  }, [isHalf, half, rawInput]);

  useEffect(() => {
    setInput(rawInput);
  }, [rawInput]);
  useEffect(() => {
    if (Big(input || placeholder).gt(max)) {
      setErrorMessage("Insufficient Balance");
    }

    if (Big(input || placeholder).lt(min)) {
      setErrorMessage(`Input can't be less than ${min}`);
    }
  }, [input, max, min, placeholder]);

  const _setInput = useCallback(
    (value: string) => {
      const precisionParsedValue = trimUnderNegativeExponent(
        value,
        negativeExponent,
      );
      setRawInput(precisionParsedValue);

      /**
       * should be set synchronously
       * otherwise, cursor jumps
       * ref: https://stackoverflow.com/questions/28922275/in-reactjs-why-does-setstate-behave-differently-when-called-synchronously/28922465#28922465
       */
      setInput(precisionParsedValue);
    },
    [negativeExponent],
  );

  const resetInput = useCallback(() => {
    setInput("");
    setRawInput("");
  }, []);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      _setInput(e.target.value);
    },
    [_setInput],
  );
  const handleBlur: React.FocusEventHandler<HTMLInputElement> = () => {
    if (rawInput === "") {
      // to preserve empty string
      return;
    }

    setRawInput((rawInput) =>
      trimTrailingZeros(Big(rawInput).toFixed(negativeExponent, Big.roundDown)),
    );
  };

  return {
    input,
    setInput: _setInput,
    resetInput,
    errorMessage,
    isMax,
    isMin,
    isHalf,
    isOverMax,
    toggleMax,
    toggleMin,
    toggleHalf,
    handleChange,
    handleBlur,
    placeholder,
  };
};

export default useInput;
