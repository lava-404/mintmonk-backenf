import React from "react";
import styles from "../../styles/SessionsStyles/InputField.module.css"

const InputField = ({ label, name, type = "text", value, onChange, options, placeholder, required }) => {
  return (
    <div className={styles.inputContainer}>
      <label className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>

      {type === "select" ? (
        <select name={name} value={value} onChange={onChange} className={styles.input}>
          <option value="">-- Select --</option>
          {options?.map((opt, idx) => (
            <option key={idx} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input 
          type={type} 
          name={name} 
          value={value} 
          onChange={onChange} 
          className={styles.input} 
          placeholder={placeholder} 
          required={required}
        />
      )}
    </div>
  );
};

export default InputField;
