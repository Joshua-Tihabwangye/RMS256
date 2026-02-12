import { useEffect, useMemo, useState } from 'react';
import type { Currency } from '../utils/currency';
import {
  loadCurrencies,
  loadSelectedCurrencyCode,
  saveSelectedCurrencyCode,
} from '../utils/currency';

export type CurrencyState = {
  currencies: Currency[];
  selected: Currency;
  selectedCode: string;
  setSelectedCode: (code: string) => void;
};

export function useCurrency(): CurrencyState {
  const currencies = useMemo(() => loadCurrencies(), []);
  const [selectedCode, setSelectedCode] = useState(() => loadSelectedCurrencyCode());

  const selected = useMemo(() => {
    return currencies.find((currency) => currency.code === selectedCode) || currencies[0];
  }, [currencies, selectedCode]);

  useEffect(() => {
    if (selected?.code) saveSelectedCurrencyCode(selected.code);
  }, [selected]);

  return {
    currencies,
    selected: selected || currencies[0],
    selectedCode: selected?.code || selectedCode,
    setSelectedCode,
  };
}
