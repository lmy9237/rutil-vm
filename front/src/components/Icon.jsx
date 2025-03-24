import { Tooltip } from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faWrench,
  faRefresh,
  faArrowsUpToLine,
  faSpinner,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";

/**
 * @name icon
 * @description ...
 * 
 * @param {string} status 상태
 * @returns 
 */
export function icon(status) {
  const tooltipId = `status-tooltip-${status}`;
  let iconProps = {};

  switch (status) {
    case "UP":
    case "OK":
    case "ACTIVE":
    case "활성화":
      iconProps = {
        icon: faPlay,
        style: {
          color: "lime",
          fontSize: "12px",
          transform: "rotate(270deg)",
        },
      };
      break;
    case "실행중":
      iconProps = {
        icon: faPlay,
        style: {
          color: "green",
          fontSize: "12px",
          transform: "rotate(120deg)",
        },
      };
      break;
    case "DOWN":
    case "비활성화":
    case "INACTIVE":
    case "UNINITIALIZED":
      iconProps = {
        icon: faPlay,
        style: { color: "red", fontSize: "12px", transform: "rotate(90deg)" },
      };
      break;
    case "POWERING_DOWN":
      iconProps = {
        icon: faArrowsUpToLine,
        style: {
          color: "red",
          fontSize: "12px",
          transform: "rotate(180deg)",
        },
      };
      break;
    case "POWERING_UP":
      iconProps = {
        icon: faSpinner,
        style: {
          color: "orange",
          fontSize: "12px",
          transform: "rotate(180deg)",
        },
      };
      break;
    case "MAINTENANCE":
      iconProps = {
        icon: faWrench,
        style: { color: "black", fontSize: "12px" },
      };
      break;
    case "REBOOT":
      iconProps = {
        icon: faRefresh,
        style: { color: "black", fontSize: "12px" },
      };
      break;
    case "SUSPENDED":
      iconProps = {
        icon: faMoon,
        style: { color: "blue", fontSize: "12px" },
      };
      break;
    default:
      return status;
  }

  return (
    <>
      <FontAwesomeIcon {...iconProps} fixedWidth data-tooltip-id={tooltipId} />
      <Tooltip id={tooltipId} place="top" effect="solid">
        {status}
      </Tooltip>
    </>
  );
}


export function renderStatusClusterIcon(connect, status) {
  if (connect && status === "OPERATIONAL") {
    return (
      <FontAwesomeIcon
        icon={faPlay}
        fixedWidth
        style={{
          color: "lime",
          fontSize: "12px",
          transform: "rotate(270deg)",
        }}
      />
    );
  } else if (connect && status === "NON_OPERATIONAL") {
    return (
      <FontAwesomeIcon
        icon={faPlay}
        fixedWidth
        style={{ color: "red", fontSize: "12px", transform: "rotate(90deg)" }}
      />
    );
  } else if (!connect) {
    return "";
  }
  return status;
}

export const renderUpDownStatusIcon = (status) => {
  if (status === "UP") {
    return (
      <FontAwesomeIcon
        icon={faPlay}
        fixedWidth
        style={{
          color: "green",
          fontSize: "12px",
          transform: "rotate(270deg)",
        }}
      />
    );
  } else if (status === "DOWN") {
    return (
      <FontAwesomeIcon
        icon={faPlay}
        fixedWidth
        style={{ color: "red", fontSize: "12px", transform: "rotate(90deg)" }}
      />
    );
  }
  return status;
};

export const renderTFStatusIcon = (status) => {
  if (status) {
    return (
      <FontAwesomeIcon
        icon={faPlay}
        fixedWidth
        style={{
          color: "green",
          fontSize: "12px",
          transform: "rotate(270deg)",
        }}
      />
    );
  } else {
    return (
      <FontAwesomeIcon
        icon={faPlay}
        fixedWidth
        style={{ color: "red", fontSize: "12px", transform: "rotate(90deg)" }}
      />
    );
  }
};

