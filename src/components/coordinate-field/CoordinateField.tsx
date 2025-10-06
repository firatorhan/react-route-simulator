import React, { type ChangeEvent } from "react";
import styles from "./CoordinateField.module.css";

interface CoordinateFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  icon?: React.ReactNode;
}

const CoordinateField: React.FC<CoordinateFieldProps> = ({
  label,
  name,
  value,
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
        type="text"
        step="any"
        id={name}
        readOnly
        name={name}
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
