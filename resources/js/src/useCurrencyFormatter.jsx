import { useState, useEffect, useCallback } from "react";

export function useCurrencyFormatter() {
  const [currency, setCurrency] = useState("USD");
  const [locale, setLocale] = useState("en-US");

  // Load currency & locale from localStorage when the component mounts
  useEffect(() => {
    const storedCurrency = localStorage.getItem("currency") || "USD";
    const storedLocale = localStorage.getItem("locale") || "en-US";
    setCurrency(storedCurrency);
    setLocale(storedLocale);
  }, []);

  // Function to format amount
  const formatAmount = useCallback(
    (amount) => {
      if (amount === null || amount === undefined || amount === "") return "";
      const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;

      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numericAmount);
    },
    [currency, locale]
  );

  return { formatAmount, currency, locale };
}
