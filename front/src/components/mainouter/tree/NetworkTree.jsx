import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useGlobal              from "@/hooks/useGlobal";
import useTmi                 from "@/hooks/useTmi";
import useContextMenu         from "@/hooks/useContextMenu";
import Loading                from "@/components/common/Loading";
import {
  rvi16Globe,
  rvi16DataCenter,
  rvi16Network,
} from "@/components/icons/RutilVmIcons";
import TreeMenuItem           from "./TreeMenuItem";
import {
  useAllTreeNavigations
} from "@/api/RQHook";
import Logger                 from "@/utils/Logger";

const NetworkTree = ({}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { contextMenu, setContextMenu, contextMenuType } = useContextMenu();
  const {
    secondVisibleNetwork, toggleSecondVisibleNetwork,
    openDataCentersNetwork, toggleOpenDataCentersNetwork
  } = useTmi();
  const { 
    setDatacentersSelected,
    setNetworksSelected
  } = useGlobal();

  // ✅ API 호출 (네트워크 트리 데이터)
  const {
    data: navNetworks=[],
    isLoading: isNavNetworksLoading,
    isSuccess: isNavNetworksSuccess,
    isError: isNavNetworksError,
  } = useAllTreeNavigations("network");
  
  const renderTree = () => {
    Logger.debug(`NetworkTree > renderTree ... `)
    {/* 레벨 2: 데이터 센터 */}
    return !!isNavNetworksLoading 
      ? (<Loading />)
      : (secondVisibleNetwork() && [...navNetworks].map((dc) => {
        const isDataCenterOpen = openDataCentersNetwork(dc?.id) || false;
        const hasNetworks = [...dc?.networks]?.length > 0;
        return (
          <div key={dc?.id} className="tmi-g">
            <TreeMenuItem level={2}
              title={dc?.name}
              iconDef={rvi16DataCenter("currentColor")}
              isSelected={() => location.pathname.includes(dc?.id)}
              isContextSelected={contextMenuType() === "datacenter" && contextMenu()?.item?.id === dc?.id}
              isNextLevelVisible={isDataCenterOpen}
              isChevronVisible={hasNetworks}
              onChevronClick={() => toggleOpenDataCentersNetwork(dc?.id)}
              onClick={() => {
                setDatacentersSelected(dc);
                dc?.id && navigate(`/networks/datacenters/${dc?.id}`);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDatacentersSelected(dc);
                setContextMenu({
                  mouseX: e.clientX,
                  mouseY: e.clientY,
                  item: {
                    ...dc,
                    level: 2,
                  },
                  treeType: "networks"
                }, "datacenter");
              }}
            />

            {/* 레벨 3: 네트워크 */}
            {isDataCenterOpen && [...dc?.networks].map((network) => (
              <div key={network.id} style={{ position: "relative" }}>
                <TreeMenuItem level={3}
                  title={network.name}
                  iconDef={rvi16Network("currentColor")}
                  isSelected={() => location.pathname.includes(network.id)}
                  isContextSelected={contextMenuType() === "network" && contextMenu()?.item?.id === network?.id}
                  isNextLevelVisible={false}
                  isChevronVisible={false}
                  onClick={() => {
                    setDatacentersSelected(dc);
                    setNetworksSelected(network);
                    navigate(`/networks/${network.id}`);
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDatacentersSelected(dc);
                    setNetworksSelected(network);
                    setContextMenu({
                      mouseX: e.clientX,
                      mouseY: e.clientY,
                      item: {
                        ...network,
                        level: 3,
                      },
                      treeType: "networks"
                    }, "network");
                  }}
                />
              </div>
            ))}
          </div>
        );
      })
    )}
  

  return (
    <div id="tmi-network" className="tmi-g">
      {/* 레벨 1: Rutil Manager */}
      <TreeMenuItem level={1}
        title="Rutil Manager"
        iconDef={rvi16Globe("currentColor")}
        isSelected={() => location.pathname.includes("rutil")}
        isContextSelected={contextMenuType() === "rutil-manager"}
        isNextLevelVisible={secondVisibleNetwork()}
        onChevronClick={() => toggleSecondVisibleNetwork()}
        isChevronVisible={true}
        onClick={() => navigate("/networks/rutil-manager")}
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenu({
            mouseX: e.clientX,
            mouseY: e.clientY,
            item: {
            },
            treeType: "networks"
          }, "rutil-manager");
        }}
      />
      {renderTree()}
    </div>
  );
};

export default NetworkTree;
