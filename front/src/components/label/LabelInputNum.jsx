import { Input } from "@/components/ui/input";

/**
 * @name LabelInputNum
 * @description 레이블 숫자 입력란 (shadcn Input 컴포넌트 기반)
 * 
 * @prop {string} className 
 * @prop {string} label 
 * @prop {string} id
 * @prop {string | number} value
 * @prop {boolean} autoFocus
 * @prop {function} onChange
 * @prop {boolean} disabled
 *  
 * @returns {JSX.Element} LabelInputNum
 */
const LabelInputNum = ({
  className = "",
  label,
  id,
  value,
  autoFocus = false,
  onChange,
  disabled = false,
  ...props
}) => {
  return (
    <div className={`input-container input-number ${className}`}>
      {label && <label htmlFor={id}>{label}</label>}
      <Input
        id={id}
        type="number"
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        disabled={disabled}
        min={0}
        {...props}
      />
    </div>
  );
};

export default LabelInputNum;

// import LabelInput from "./LabelInput";

// /**
//  * @name LabelInputNum
//  * @description 레이블 숫자 입력란
//  * 
//  * @prop {string} className 
//  * @prop {string} label 
//  * @prop {string} id
//  * @prop {string} value
//  * @prop {boolean} autoFocus
//  * @prop {function} onChange
//  * @prop {boolean} disabled
//  *  
//  * @returns {JSX.Element} LabelInputNum
//  */
// const LabelInputNum = ({
//   label,
//   id,
//   value,
//   autoFocus = false,
//   ...props
// }) => ( 
//   <LabelInput id={id}
//     label={label}
//     value={value}
//     autoFocus={autoFocus}
//     {...props}
//   />
// );

// export default LabelInputNum;
