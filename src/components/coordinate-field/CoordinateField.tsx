import React, { type ChangeEvent } from "react";
import styles from "./CoordinateField.module.css";

type inputType = "number" | "text";

interface CoordinateFieldProps {
  label: string;
  name: string;
  value: string | number;
  type?: inputType;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  icon?: React.ReactNode;
}

const CoordinateField: React.FC<CoordinateFieldProps> = ({
  label,
  name,
  value,
  disabled,
  type = "text",
  onChange,
  onClick,
  icon,
}) => {
  return (
    <div className={styles.field}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <input
        type={type}
        step="any"
        id={name}
        name={name}
        disabled={disabled}
        value={value}
        onChange={onChange}
        onClick={onClick}
        className={styles.input}
        placeholder="example: 41.0082, -3.0122"
      />
      {icon && <span className={styles.icon}>{icon}</span>}
    </div>
  );
};

export default CoordinateField;
