import { Checkbox }           from "@/components/ui/checkbox"
import { Label }              from "@/components/ui/label";
/**
 * @name LabelCheckbox
 * @description 레이블 체크박스
 * 
 * @prop {string} className 
 * @prop {string} label 
 * @prop {string} id
 * @prop {string} value
 * @prop {boolean} autoFocus
 * @prop {function} onChange
 * @prop {boolean} disabled
 *  
 * @returns {JSX.Element} LabelInput
 */
const LabelCheckbox = ({
  label,
  autoFocus=false,
  checked,
  onChange,
  disabled,
  required,
  onClick,
  ...props
}) => (
  <div className={`input-checkbox f-start gap-4 ${props.className || ''}`} onClick={onClick}>
    <Checkbox variant="default" id={props.id}
      checked={checked}
      onCheckedChange={onChange}      
      disabled={disabled}
      required={required}
      autoFocus={autoFocus}
    />
    {/* <input id={props.id} type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      required={required}
      autoFocus={autoFocus} /> */}
    {label && <Label htmlFor={props.id}>{label}</Label>}
  </div>
);


export default LabelCheckbox;