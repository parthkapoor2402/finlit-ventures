"use client";

import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import styles from "./TextField.module.css";

type Shared = {
  label: string;
  hint?: string;
  error?: string;
  id?: string;
};

type TextProps = Shared & InputHTMLAttributes<HTMLInputElement>;

function FieldChrome({
  label,
  hint,
  error,
  id,
  children,
}: Shared & { children: (ids: { fieldId: string; describedBy?: string }) => ReactNode }) {
  const generated = useId();
  const fieldId = id ?? generated;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={styles.field}>
      <label htmlFor={fieldId}>{label}</label>
      {children({ fieldId, describedBy })}
      {hint ? (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({ label, hint, error, id, ...props }: TextProps) {
  return (
    <FieldChrome label={label} hint={hint} error={error} id={id}>
      {({ fieldId, describedBy }) => (
        <input
          id={fieldId}
          className={styles.control}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...props}
        />
      )}
    </FieldChrome>
  );
}

type SelectProps = Shared & SelectHTMLAttributes<HTMLSelectElement>;

export function SelectField({ label, hint, error, id, children, ...props }: SelectProps) {
  return (
    <FieldChrome label={label} hint={hint} error={error} id={id}>
      {({ fieldId, describedBy }) => (
        <select
          id={fieldId}
          className={styles.control}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...props}
        >
          {children}
        </select>
      )}
    </FieldChrome>
  );
}
