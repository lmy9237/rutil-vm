import { RVI16 } from "@/components/icons/RutilVmIcons";
import "./ActionButtons.css"
import { icons } from "lucide-react";

export const ActionButtons = ({
  actionType="default",
  actions=[],
  manageActions = [],
  ...props
}) => {
  return (
    <div className={
      actionType === "context" 
        ? "right-click-menu-box"
        : "header-right-btns"
      }>
      {actions.map(({
        type, 
        label, 
        iconPrefix, iconSuffix,
        disabled, 
        onClick,
        subactions = [],
      }) => (<>
        <ActionButton key={type}
          actionType={actionType}
          disabled={disabled}
          label={label}
          iconPrefix={iconPrefix}
          iconSuffix={iconSuffix}
          onClick={onClick}
        />
      </>))}
      {props.children}
    </div>
  )
}

export const ActionButton = ({ 
  actionType = "default",
  label = "",
  iconPrefix, iconSuffix, ...props 
}) => {
  return (
    <button className={actionType === "context" ? "btn-right-click" : "btn-action"}
      {...props}
    >
      {iconPrefix && <RVI16 iconDef={iconPrefix} />}
      {label}
      {iconSuffix && <RVI16 iconDef={iconSuffix} />}
    </button>
 );
}

export default ActionButton;
