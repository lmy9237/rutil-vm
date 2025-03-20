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

export function renderDataCenterStatus(status) {
  if (status === "UNINITIALIZED") {
    return "초기화되지 않음";
  }
  return status;
}

export function renderDomainStatus(status) {
  if (status === "ACTIVE") {
    return "활성화";
  } else if (status === "DOWN") {
    return "중지";
  } else if (status === "INACTIVE") {
    return "비활성화";
  }
  return status;
}

export function renderDataCenterStatusIcon(status) {
  if (status === "ACTIVE") {
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
  } else if (status === "DOWN") {
    return (
      <FontAwesomeIcon
        icon={faPlay}
        fixedWidth
        style={{ color: "red", fontSize: "12px", transform: "rotate(90deg)" }}
      />
    );
  } else if (status === "MAINTENANCE") {
    return (
      <FontAwesomeIcon
        icon={faWrench}
        fixedWidth
        style={{ color: "black", fontSize: "12px" }}
      />
    );
  }
  return status;
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

export const renderVmStatusIcon = (status) => {
  return icon(status);
};

export const renderDomainStatusIcon = (status) => {
  return icon(status);
};

export const renderEventStatusIcon = (status) => {
  return icon(status);
};

export const renderDatacenterStatusIcon = (status) => {
  return icon(status);
};
export const renderHostStatusIcon = (status) => {
  return icon(status);
};
