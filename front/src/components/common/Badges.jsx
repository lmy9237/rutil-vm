import { useMemo } from "react";
import "./Badges.css"

/**
 * @name BadgeStatus
 * 
 * @param {string} status
 * @prop {string} text 
 * @returns 
 */
export const BadgeStatus = ({
  status="default",
  text="없음",
  ...props
}) => {
  const isNumber = useMemo(() => 
    status === "number" || 
    status === "alert"
  , [status, text])
  
  return (
    <span className={`badge-status f-center ${isNumber ? `${status} mini fs-8` : status}`}
      {...props}
    >
      {text}
    </span>
  )
  
};

export const BadgeNumber = ({
  status="number",
  text="0"
}) => (
<BadgeStatus 
  status={status}
  text={text}
/>)

export default BadgeStatus;
