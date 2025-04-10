import ActionButton from "./ActionButton"
import "./ActionButtonsGroup.css"

const ActionButtonGroup = ({
  actionType = "default",
  isContextMenu = false,
  actions = [],
  manageActions = [],
  ...props
}) => {
  return (
    <div className={actionType === "context" ? "right-click-menu-box" : "header-right-btns"}>
      {actions.map(({type, label, disabled, onBtnClick }) => (
        <ActionButton key={type}
          actionType={actionType}
          disabled={disabled}
          label={label}
          onClick={onBtnClick}
        />
      ))}
      {props.children}
    </div>
  )
}

export default ActionButtonGroup;
