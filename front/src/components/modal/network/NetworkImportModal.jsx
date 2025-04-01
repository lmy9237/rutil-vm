import React, { useEffect, useState } from "react";
import BaseModal from "../BaseModal";
import { useAllNetworkProviders } from "../../../api/RQHook";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import Localization from "../../../utils/Localization";
import TablesOuter from "../../table/TablesOuter";
import TableColumnsInfo from "../../table/TableColumnsInfo";
import Logger from "../../../utils/Logger";
import "./MNetwork.css";

const NetworkImportModal = ({ isOpen, onClose, onSubmit }) => {
  const {
    data: networkProvider = [],
    isLoading: isDatacentersLoading
  } = useAllNetworkProviders();

  useEffect(() => {
    Logger.debug(`NetworkImportModal ... 📢 네트워크 공급자 데이터: ${JSON.stringify(networkProvider)}`);
  }, [networkProvider]);

  const [networkList, setNetworkList] = useState([
    {
      id: "network_1",
      name: "네트워크 A",
      networkId: "ID-1234",
      dataCenter: `예시 ${Localization.kr.DATA_CENTER}`,
      allowAll: false,
    }, {
      id: "network_2",
      name: "네트워크 B",
      networkId: "ID-5678",
      dataCenter: `예시 ${Localization.kr.DATA_CENTER}`,
      allowAll: false,
    },
  ]);

  const [providerNetworks, setProviderNetworks] = useState([
    { id: "provider_1", name: "공급자 네트워크 A", networkId: "예시시" },
    { id: "provider_2", name: "공급자 네트워크 B", networkId: "예시시" },
  ]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  // 전체 선택 체크박스 핸들러
  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    setNetworkList((prev) =>
      prev.map((network) => ({ ...network, allowAll: isChecked }))
    );
  };

  // 개별 체크박스 핸들러
  const handleCheckboxChange = (id) => {
    setNetworkList((prev) =>
      prev.map((network) =>
        network.id === id
          ? { ...network, allowAll: !network.allowAll }
          : network
      )
    );
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}
      targetName={Localization.kr.NETWORK}
      submitTitle={"가져오기"}
      onSubmit={onSubmit}
      contentStyle={{ width: "880px" }} 
    >
      

        {/* 네트워크 공급자 목록 */}
        <LabelSelectOptions
          id="cluster"
          label="네트워크 공급자"
          className="network-form-group f-btw"
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
          disabled={isDatacentersLoading}
          options={
            isDatacentersLoading
              ? [{ value: "", label: "로딩 중..." }]
              : networkProvider.length > 0
              ? networkProvider.map((provider) => ({
                  value: provider.name,
                  label: provider.name,
                }))
              : [{ value: "", label: "공급자 없음" }]
          }
        />

        {/* 공급자 네트워크 테이블 */}
        <div className="network-bring-table-outer">
          <h1 className="font-bold">공급자 네트워크</h1>
          <TablesOuter
            columns={TableColumnsInfo.PROVIDER_NETWORKS}
            data={providerNetworks.map((provider) => ({
              id: provider.id,
              select: (
                <input
                  type="checkbox"
                  checked={provider.allowAll}
                  onChange={() =>
                    setProviderNetworks((prev) =>
                      prev.map((p) =>
                        p.id === provider.id
                          ? { ...p, allowAll: !p.allowAll }
                          : p
                      )
                    )
                  }
                />
              ),
              name: provider.name,
              networkId: provider.networkId,
            }))}
            showSearchBox={true}
          />
        </div>


        {/* 가져올 네트워크 테이블 */}
        <div className="network-bring-table-outer">
          <h1 className="font-bold">가져올 네트워크</h1>
          <TablesOuter
            columns={TableColumnsInfo.IMPORT_NETWORKS}
            data={networkList.map((network) => ({
              id: network.id,
              select: (
                <input
                  type="checkbox"
                  checked={network.allowAll}
                  onChange={() => handleCheckboxChange(network.id)}
                />
              ),
              name: network.name,
              networkId: network.networkId,
              dataCenter: network.dataCenter,
              allowAll: (
                <input
                  type="checkbox"
                  checked={network.allowAll}
                  onChange={() => handleCheckboxChange(network.id)}
                />
              ),
            }))}
            showSearchBox={true}
          />
        </div>


 
    </BaseModal>
  );
};

export default NetworkImportModal;
