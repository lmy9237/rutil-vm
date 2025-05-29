import React, { useEffect, useState } from "react";
import useGlobal from "../../../hooks/useGlobal";
import useUIState from "../../../hooks/useUIState";
import BaseModal from "../BaseModal";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import Localization from "../../../utils/Localization";
import TablesOuter from "../../table/TablesOuter";
import { RVI24, rvi24ChevronDown, rvi24ChevronUp, rvi24DownArrow } from "../../icons/RutilVmIcons";
import { useAllNetworkProviders } from "../../../api/RQHook";
import Logger from "../../../utils/Logger";
import "./MNetwork.css";

const NetworkImportModal = ({
  isOpen,
  onClose,
  onSubmit 
}) => {
  // const { closeModal } = useUIState()
  const {
    networkProvidersSelected, setNetworkProvidersSelected
  } = useGlobal()
  const {
    data: networkProvider = [],
    isLoading: isDatacentersLoading
  } = useAllNetworkProviders();
  const providerNetworkColumns = [
    {
      accessor: "select", 
      header: (
        <input type="checkbox" id="provider_select_all"
          onChange={() => {}} // 임시: 아무것도 안 함
        />
      ),
      width: "50px",
    },
    { accessor: "name",      header: "이름",  },
    { accessor: "networkId", header: "공급자의 네트워크 ID", },
  ];
  
  const importNetworkColumns = [
    {
      accessor: "select",
      header: (
        <input
          type="checkbox"
          id="import_select_all"
          onChange={() => {}} // 임시
        />
      ),
      width: "50px",
    },
    { accessor: "name",       header: "이름" },
    { accessor: "networkId",  header: "공급자의 네트워크 ID", },
    { accessor: "dataCenter", header: "데이터 센터", },
    {
      accessor: "allowAll",
      header: (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="allow_all"
            onChange={() => {}} // ✅ 아무것도 안 함
          />
          <label htmlFor="allow_all" className="ml-1">모두 허용</label>
        </div>
      ),
      width: "50px",
    },
  ];
  
  
  
  const [providerNetworks, setProviderNetworks] = useState([
    { id: "provider_1", name: "공급자 네트워크 A", networkId: "NET-001", selected: false },
    { id: "provider_2", name: "공급자 네트워크 B", networkId: "NET-002", selected: false },
  ]);
  
  const [networkList, setNetworkList] = useState([
    { id: "network_1", name: "가져올 네트워크 A", networkId: "NET-101", dataCenter: "DC-01", allowAll: false, selected: false },
    { id: "network_2", name: "가져올 네트워크 B", networkId: "NET-102", dataCenter: "DC-02", allowAll: false, selected: false },
  ]);
  const [selectAll, setSelectAll] = useState(false);

  return (
    <BaseModal targetName={Localization.kr.NETWORK} submitTitle={Localization.kr.IMPORT}
      isOpen={isOpen} onClose={onClose}
      onSubmit={onSubmit}
      contentStyle={{ width: "880px" }} 
    >
      {/* 네트워크 공급자 목록 */}
      <LabelSelectOptions id="cluster"
        label="네트워크 공급자"
        className="f-btw "
        value={networkProvidersSelected}
        onChange={(e) => setNetworkProvidersSelected(e.target.value)}
        disabled={isDatacentersLoading}
        loading={isDatacentersLoading}
        options={[...networkProvider]}
        placeholderLabel={"공급자 없음"}
      />

      {/* 공급자 네트워크 테이블 */}
      <div className="network-bring-table-outer">
        <h1 className="font-bold">공급자 네트워크</h1>
        <TablesOuter columns={providerNetworkColumns}
          data={providerNetworks.map((provider) => ({
            id: provider.id,
            select: (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`provider_select_${provider.id}`}
                  checked={provider.selected}
                  onChange={() => {
                    setProviderNetworks((prev) =>
                      prev.map((p) =>
                        p.id === provider.id ? { ...p, selected: !p.selected } : p
                      )
                    );
                  }}
                />
              </div>
            ),
            name: provider.name,
            networkId: provider.networkId,
          }))}
        />
      </div>

      <div className="f-center py-2">
        <RVI24 iconDef={rvi24ChevronUp()} className="mr-3" />
        <RVI24 iconDef={rvi24ChevronDown()}  />
      </div>

      {/* 가져올 네트워크 테이블 */}
      <div className="network-bring-table-outer">
        <h1 className="font-bold ">가져올 네트워크</h1>
        <TablesOuter target={"network"}
          columns={importNetworkColumns}
          data={[...networkList].map((network) => ({
            id: network.id,
            select: (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`import_select_${network.id}`}
                  checked={network.selected}
                  onChange={() => {
                    setNetworkList((prev) =>
                      prev.map((n) =>
                        n.id === network.id ? { ...n, selected: !n.selected } : n
                      )
                    );
                  }}
                />
              </div>
            ),
            name: network.name,
            networkId: network.networkId,
            dataCenter: network.dataCenter,
            allowAll: (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`allowAll_${network.id}`}
                  checked={network.allowAll}
                  onChange={() => {
                    setNetworkList((prev) =>
                      prev.map((n) =>
                        n.id === network.id ? { ...n, allowAll: !n.allowAll } : n
                      )
                    );
                  }}
                />
              </div>
            ),
          }))}
        />
      </div>
    </BaseModal>
  );
};

export default NetworkImportModal;
