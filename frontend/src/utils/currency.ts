export type Currency = {
  code: string;
  symbol: string;
  rate: number; // 1 USD = rate * currency
  name: string;
};


const SELECTED_KEY = 'rms256_currency_selected';

// Major global currencies + East African Community currencies with realistic rates vs USD
export const PRESET_CURRENCIES: Currency[] = [
  // Major global currencies
  { code: 'USD', symbol: '$', rate: 1, name: 'US Dollar' },
  { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro' },
  { code: 'GBP', symbol: '£', rate: 0.79, name: 'British Pound' },
  { code: 'JPY', symbol: '¥', rate: 149.5, name: 'Japanese Yen' },
  { code: 'CHF', symbol: 'CHF', rate: 0.88, name: 'Swiss Franc' },
  { code: 'CAD', symbol: 'C$', rate: 1.36, name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', rate: 1.53, name: 'Australian Dollar' },
  { code: 'CNY', symbol: '¥', rate: 7.24, name: 'Chinese Yuan' },
  // East African Community currencies
  { code: 'KES', symbol: 'KSh', rate: 153.5, name: 'Kenyan Shilling' },
  { code: 'UGX', symbol: 'USh', rate: 3780, name: 'Ugandan Shilling' },
  { code: 'TZS', symbol: 'TSh', rate: 2520, name: 'Tanzanian Shilling' },
  { code: 'RWF', symbol: 'RF', rate: 1280, name: 'Rwandan Franc' },
  { code: 'BIF', symbol: 'FBu', rate: 2860, name: 'Burundian Franc' },
  { code: 'SSP', symbol: 'SSP', rate: 1150, name: 'South Sudanese Pound' },
];

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadCurrencies(): Currency[] {
  return PRESET_CURRENCIES;
}

export function saveCurrencies(_currencies: Currency[]) {
  // No-op: currencies are now preset
}

export function loadSelectedCurrencyCode(): string {
  if (!isBrowser()) return 'USD';
  return window.localStorage.getItem(SELECTED_KEY) || 'USD';
}

export function saveSelectedCurrencyCode(code: string) {
  if (!isBrowser()) return;
  window.localStorage.setItem(SELECTED_KEY, code);
}

export function normalizeCurrency(input: Currency): Currency {
  return {
    code: input.code.trim().toUpperCase(),
    symbol: input.symbol.trim() || input.code.trim().toUpperCase(),
    rate: Number.isFinite(input.rate) && input.rate > 0 ? input.rate : 1,
    name: input.name.trim() || input.code.trim().toUpperCase(),
  };
}

export function convertFromBase(value: number, currency: Currency): number {
  if (!Number.isFinite(value)) return 0;
  const rate = currency.rate > 0 ? currency.rate : 1;
  return value * rate;
}

export function convertToBase(value: number, currency: Currency): number {
  if (!Number.isFinite(value)) return 0;
  const rate = currency.rate > 0 ? currency.rate : 1;
  return value / rate;
}

export function formatCurrency(value: number, currency: Currency): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      maximumFractionDigits: 2,
    }).format(safeValue);
  } catch {
    return `${currency.symbol}${safeValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  }
}

/** Format a value that is already in the given currency (no conversion). */
export function formatPriceInCurrency(value: number, symbol: string, code: string): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 2,
    }).format(safeValue);
  } catch {
    return `${symbol}${safeValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  }
}

export function getDefaultCurrencies() {
  return PRESET_CURRENCIES;
}
