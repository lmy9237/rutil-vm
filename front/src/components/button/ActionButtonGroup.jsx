import ActionButton from "./ActionButton"
import "./ActionButtonsGroup.css"

const ActionButtonGroup = ({
  actionType = "default",
  actions = [],
  manageActions = [],
  ...props
}) => {
  return (
    <div className={actionType === "context" ? "right-click-menu-box" : "header-right-btns"}>
      {actions.map(({
        type, 
        label, 
        disabled, 
        onBtnClick, 
        subactions = [],
      }) => (<>
        <ActionButton key={type}
          actionType={actionType}
          disabled={disabled}
          label={label}
          onClick={onBtnClick}
        />
        {/* {[...subactions]?.map(({ type, label, disabled, onBtnClick }) => (
          <button key={type}
            className="btn-right-click dropdown-item"
            disabled={disabled}
            onClick={onBtnClick}
          >
            {label}
          </button>
        ))} */}
      </>))}
      {props.children}
    </div>
  )
}

export default ActionButtonGroup;
