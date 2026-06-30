import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const FIELD_BASE =
  "w-full rounded-xl border border-line bg-ink-soft px-4 py-3 text-sm text-cream placeholder:text-muted/70 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";

interface FieldWrapperProps {
  readonly label: string;
  readonly htmlFor: string;
  readonly error?: string;
  readonly children: React.ReactNode;
}

function FieldWrapper({ label, htmlFor, error, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium text-muted">
        {label}
      </label>
      {children}
      {error ? <span className="text-xs text-red-400">{error}</span> : null}
    </div>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly label: string;
  readonly id: string;
  readonly error?: string;
}

export function TextField({ label, id, error, className, ...rest }: TextFieldProps) {
  return (
    <FieldWrapper label={label} htmlFor={id} error={error}>
      <input id={id} className={cn(FIELD_BASE, className)} {...rest} />
    </FieldWrapper>
  );
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  readonly label: string;
  readonly id: string;
  readonly error?: string;
}

export function TextAreaField({
  label,
  id,
  error,
  className,
  ...rest
}: TextAreaFieldProps) {
  return (
    <FieldWrapper label={label} htmlFor={id} error={error}>
      <textarea id={id} className={cn(FIELD_BASE, "resize-none", className)} {...rest} />
    </FieldWrapper>
  );
}
