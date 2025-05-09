import React, { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-away.css";
import Logger from "../../utils/Logger";
import "./Grid.css";

const Grid = ({ 
  type,
  data = []
}) => {
  const [gridData, setGridData] = useState([]);
  const numMax = 15
  useEffect(() => {
    Logger.debug(`Grid > useEffect ... `)
    const filledData = [...data];
    while (filledData.length < numMax) {
      filledData.push({
        id: `placeholder-${filledData.length}`,
        cpuPercent: null,
        memoryPercent: null,
        name: "",
        status: "",
      });
    }
    if (JSON.stringify(filledData) !== JSON.stringify(gridData)) {
      setGridData(filledData);
    }
  }, [data, gridData]);

  return (<>
    <div className="grid-matrix">
      {[...gridData].map((item, index) => (
        (item.name === "") 
          ? <GridItem key={item.id} type={type} item={item} index={index} />
          : <Tippy
              key={item.id}
              content={<div className="v-center">{item.name || ""}</div>}
              placement="top"
              theme="dark-tooltip"
              animation="shift-away"
              arrow={true}
            >
              <GridItem type={type} item={item} index={index} />
            </Tippy>
      ))}
    </div>
      {/*    {[...gridData].map((item, index) => (
      (item.name === "") 
        ? <GridItem type={type} item={item} index={index} />
        : <Tippy content={<div className="v-center">{item.name || ""}</div>}
            placement="top"
            theme="dark-tooltip"
            animation="shift-away"
            arrow={true}
          > 
            <GridItem type={type} item={item} index={index} />
          </Tippy>
    ))} */}
  </>);
};

const GridItem = forwardRef(({
  type,
  item,
  index
}, ref) => {
  const navigate = useNavigate();
  const hasAnyData = useMemo(() => 
    item.cpuPercent !== null || item.memoryPercent !== null
  , [item])

  const severity2Label = useCallback((value) => {
    Logger.debug(`Grid > severity2Label ... value: ${value}`)
    if (value === null) return "disabled";
    if (value === 0) return "empty";
    if (value < 65) return "okay";
    else if (value >= 65 && value < 75) return "norm";
    else if (value >= 75 && value < 90) return "warn";
    else if (value >= 90) return "crit";
  }, [])

  const useMetricByType = useMemo(() => (
    type === "cpu" 
      ? item?.cpuPercent
      : item?.memoryPercent
  ), [type, item]);

  const handleClick = useCallback((id) => {
    if (id && id.startsWith("placeholder")) return;
    if (type === "domain") {
      navigate(`/storages/domains/${id}`);
    } else {
      navigate(`/computing/vms/${id}`);
    }
  }, []);

  return (
    <div key={item.id || index} ref={ref}
      className={
        `grid-item v-center ${severity2Label(useMetricByType)}`
      }
      onClick={() => hasAnyData && handleClick(item.id)}
    >
      {hasAnyData ? (
        <>
          <div className="percent f-center">
            <h1 className="fs-14 fw-500">{useMetricByType}</h1>
            <div className="percent unit">%</div>
          </div>
          <div className="grid-item-name fs-10">{item.name}</div>
        </>
      ) : (
        <div className="percent f-center" style={{ color: "rgb(0 0 0)" }}></div>
      )}
    </div>
  )
})

export default Grid;
