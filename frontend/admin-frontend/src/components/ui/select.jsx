import React, { createContext, useContext, useState, useEffect } from "react";

const SelectContext = createContext({
  value: "",
  onValueChange: () => {},
  selectedLabel: "",
  setSelectedLabel: () => {},
});

export function Select({ value, onValueChange, children }) {
  const [selectedLabel, setSelectedLabel] = useState("");
  return (
    <SelectContext.Provider value={{ value, onValueChange, selectedLabel, setSelectedLabel }}>
      <div style={{ position: "relative", display: "inline-block" }}>{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ className = "", children, ...props }) {
  return (
    <div className={className} style={{ position: "relative", cursor: "pointer" }} {...props}>
      {children}
    </div>
  );
}

export function SelectValue({ placeholder = "" }) {
  const ctx = useContext(SelectContext);
  return <span>{ctx.selectedLabel || ctx.value || placeholder}</span>;
}

export function SelectContent({ children, className = "" }) {
  const ctx = useContext(SelectContext);

  useEffect(() => {
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && child.props.value === ctx.value) {
        ctx.setSelectedLabel?.(child.props.children);
      }
    });
  }, [ctx.value, children]);

  return (
    <select
      value={ctx.value}
      onChange={(e) => {
        ctx.onValueChange?.(e.target.value);
        const sel = React.Children.toArray(children).find(
          (c) => React.isValidElement(c) && c.props.value === e.target.value
        );
        if (sel) {
          ctx.setSelectedLabel?.(sel.props.children);
        }
      }}
      className="drv-native-select"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity: 0,
        cursor: "pointer",
      }}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return (
            <option value={child.props.value}>
              {child.props.children}
            </option>
          );
        }
        return null;
      })}
    </select>
  );
}

export function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>;
}
