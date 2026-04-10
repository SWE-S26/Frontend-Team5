import ToggleSwitch from "@/components/settings/ToggleSwitch";

interface PrivacySettingRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function PrivacySettingRow({
  label,
  description,
  checked,
  onChange,
}: PrivacySettingRowProps) {
  return (
    <>
      <div className="flex items-start justify-between gap-6 py-5">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white-smoke leading-snug">
            {label}
          </p>
          <p className="text-sm text-white-smoke/50 mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="shrink-0 pt-0.5">
          <ToggleSwitch checked={checked} onChange={onChange} />
        </div>
      </div>
    </>
  );
}