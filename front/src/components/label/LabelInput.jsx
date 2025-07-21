import { useState } from "react";
import { FontAwesomeIcon }              from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash }            from "@fortawesome/free-solid-svg-icons";
import { RVI16, rvi16Eye, rvi16EyeSlash } from "../icons/RutilVmIcons";
import { Input }                        from "@/components/ui/input";
import { Label }                        from "@/components/ui/label";
import "./LabelInput.css";

/**
 * @name LabelInput
 * @description shadcn Input을 기반으로 한 입력 필드 (비밀번호 보기 지원 포함)
 *
 * @prop {string} className
 * @prop {string} label
 * @prop {string} id
 * @prop {string} value
 * @prop {boolean} autoFocus
 * @prop {boolean} isEnglishOnly
 * @prop {function} onChange
 * @prop {boolean} disabled
 * @prop {boolean} required
 * @prop {string} type
 *
 * @returns {JSX.Element}
 */
const LabelInput = ({
  className = "",
  type = "text",
  label,
  id,
  value,
  onChange,
  register, target, options={},
  autoFocus = false,
  isEnglishOnly = false,
  onInvalid,
  required = false,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";
  const inputType = isPasswordType && showPassword ? "text" : type;
 
  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className={`input-container ${className}`}>
      {label && <Label htmlFor={id} className="select-label">{label}</Label>}
      <Input id={id}
        type={inputType}
        placeholder={props.placeholder ?? label}
        value={value}
        autoFocus={autoFocus}
        onChange={onChange}
        onInvalid={onInvalid}
        disabled={props.disabled}
        required={required}
        autoComplete={props.autoComplete}
        // {...register(target, options)}
      />
      {isPasswordType && (
        <div
          onClick={togglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
        >
          <RVI16 iconDef={showPassword ? rvi16EyeSlash() : rvi16Eye()} />
        </div>
      )}
    </div>
  );
};

export default LabelInput;