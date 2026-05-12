type TextAreaProps = {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
};

export function TextArea({ label, hint, value, onChange, rows = 4, placeholder }: TextAreaProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-300 mb-1">
        {label}
      </label>
      {hint && <p className="text-stone-500 text-xs mb-2">{hint}</p>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full bg-stone-900 border border-stone-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-3 text-white text-sm placeholder-stone-600 transition-colors resize-none outline-none"
      />
    </div>
  );
}

type NumberFieldProps = {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
};

export function NumberField({ label, hint, value, onChange, placeholder, min, max }: NumberFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-300 mb-1">
        {label}
      </label>
      {hint && <p className="text-stone-500 text-xs mb-2">{hint}</p>}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full bg-stone-900 border border-stone-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-3 text-white text-sm placeholder-stone-600 transition-colors outline-none"
      />
    </div>
  );
}