import type { Currency } from '../utils/currency';
import './CurrencyControls.css';

interface CurrencyControlsProps {
  currencies: Currency[];
  selectedCode: string;
  onChange: (code: string) => void;
  compact?: boolean;
}

export default function CurrencyControls({
  currencies,
  selectedCode,
  onChange,
  compact = false,
}: CurrencyControlsProps) {
  const majorCodes = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY'];
  const major = currencies.filter((c) => majorCodes.includes(c.code));
  const eac = currencies.filter((c) => !majorCodes.includes(c.code));

  return (
    <div className={`currency-controls ${compact ? 'compact' : ''}`}>
      <div className="currency-controls-row">
        {!compact && <span className="currency-label">Currency</span>}
        <div className="currency-select-wrapper">
          <select
            className="currency-select"
            value={selectedCode}
            onChange={(e) => onChange(e.target.value)}
          >
            <optgroup label="Major Currencies">
              {major.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.code} — {c.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="East African Community">
              {eac.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.code} — {c.name}
                </option>
              ))}
            </optgroup>
          </select>
          <span className="currency-select-icon">▾</span>
        </div>
      </div>
    </div>
  );
}
