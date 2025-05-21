import { RVI16 } from "@/components/icons/RutilVmIcons";
import "./ActionButtons.css"

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
        disabled, 
        onClick,
        subactions = [],
      }) => (<>
        <ActionButton key={type}
          actionType={actionType}
          disabled={disabled}
          label={label}
          onClick={onClick}
        />
      </>))}
      {props.children}
    </div>
  )
}

export const ActionButton = ({ 
  actionType = "default",
  label = "", iconDef, ...props 
}) => {
  return (
    <button className={actionType === "context" ? "btn-right-click" : "btn-action"}
      {...props}
    >
      {label}
      {iconDef && <RVI16 iconDef={iconDef} />}
    </button>
 );
}

export default ActionButton;
