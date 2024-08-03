import { ChangeEvent, FocusEvent, useCallback, useState } from "react";
import "./App.css";

const locales: { [x: string]: string } = {
  USD: "en-US",
  INR: "en-IN",
};

function App() {
  const [currency, setCurrency] = useState<string>("");
  const [locale, setLocale] = useState<string>("");

  function handleCurrency(value: string) {
    setCurrency(value);
  }

  function handleLocale(value: string) {
    setLocale(value);
  }

  // removes everything except digits.
  function removeNonDigit(value: string): string {
    return value.replace(/\D/g, "");
  }

  // formats number in selected currency and locale.
  const formatNumber = useCallback(
    (value: string): string => {
      return new Intl.NumberFormat(locale, {
        currency: currency,
      }).format(Number(removeNonDigit(value)));
    },
    [currency, locale]
  );

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value,
      ele = e.target,
      original_length = value.length;
    let initialPosition,
      updated_length = value.length;

    // store the initial position of cursor
    if (ele) {
      initialPosition = ele.selectionStart;
    }

    if (value.indexOf(".") >= 0) {
      // get index of decimal
      const decimal_pos = value.indexOf(".");
      // get left part
      let left_part = value.substring(0, decimal_pos);
      // get right part
      let right_part = value.substring(decimal_pos);
      // format the left part
      left_part = formatNumber(left_part);
      right_part = removeNonDigit(right_part);
      // join left and right with a "."
      const final_part = left_part + "." + right_part;
      // update the length of the value.
      updated_length = final_part.length;
      // pass the final value to field value.
      e.target.value = final_part;
    } else {
      const final_part = formatNumber(value);
      // update the length of the value.
      updated_length = final_part.length;
      // pass the final value to field value.
      e.target.value = final_part;
    }

    // to update the cursor position
    if (initialPosition && ele) {
      const finalPosition = updated_length - original_length + initialPosition;
      ele.setSelectionRange(finalPosition, finalPosition);
    }
  }

  function handleBlur(e: FocusEvent<HTMLInputElement, Element>) {
    const value = e.target.value;
    if (value === "") {
      return undefined;
    }
    if (value.indexOf(".") >= 0) {
      const split_array = value.split(".");
      if (split_array.length === 2 && Number(split_array[1]) === 0) {
        e.target.value = split_array[0];
      }
    }
  }

  return (
    <main>
      <div className="locale-currency">
        <div className="currency_container">
          <label htmlFor="currency">Currency</label>
          <select
            name="currency"
            id="currency"
            value={currency}
            onChange={(e) => {
              handleCurrency(e.target.value);
              handleLocale(locales[e.target.value]);
            }}
          >
            <option value="" hidden>
              select currency
            </option>
            <option value="INR" key={"INR"}>
              INR
            </option>
            <option value="USD" key={"USD"}>
              USD
            </option>
          </select>
        </div>
        <div className="locale_container">
          <label htmlFor="locale">Locale</label>
          <select name="locale" id="locale" value={locale} disabled>
            <option value="" hidden>
              select locale
            </option>
            <option value="en-IN" key={"en-IN"}>
              en-IN
            </option>
            <option value="en-US" key={"en-US"}>
              en-US
            </option>
          </select>
        </div>
      </div>
      <div className="input_container">
        <label htmlFor="format">Formatted value</label>
        <input
          type="text"
          name="format"
          id="format"
          inputMode="numeric"
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
    </main>
  );
}

export default App;
