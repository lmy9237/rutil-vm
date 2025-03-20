import React, { useEffect, useState } from "react";
import BaseModal from "../BaseModal";
import { useAllNetworkProviders } from "../../../api/RQHook";
import LabelSelectOptions from "../../label/LabelSelectOptions";
import Localization from "../../../utils/Localization";
import "./MNetwork.css";

const NetworkImportModal = ({ isOpen, onClose, onSubmit }) => {
  const {
    data: networkProvider = [],
    isLoading: isDatacentersLoading
  } = useAllNetworkProviders();

  useEffect(() => {
    console.log("📢 네트워크 공급자 데이터:", networkProvider);
  }, [networkProvider]);

  const [networkList, setNetworkList] = useState([
    {
      id: "network_1",
      name: "네트워크 A",
      networkId: "ID-1234",
      dataCenter: `예시 ${Localization.kr.DATA_CENTER}`,
      allowAll: false,
    },
    {
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
      targetName={"네트워크"}
      submitTitle={"가져오기"}
      onSubmit={onSubmit}
      contentStyle={{ width: "880px" }} 
    >
      

        {/* 네트워크 공급자 목록 */}
        <LabelSelectOptions
          id="cluster"
          label="네트워크 공급자"
          className="network-form-group center"
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
          <span className="font-bold">공급자 네트워크</span>
          <div>
            <table className="network-new-cluster-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="provider_select_all"
                      checked={providerNetworks.every(
                        (provider) => provider.allowAll
                      )}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setProviderNetworks((prev) =>
                          prev.map((provider) => ({
                            ...provider,
                            allowAll: isChecked,
                          }))
                        );
                      }}
                    />
                  </th>
                  <th>이름</th>
                  <th>공급자의 네트워크 ID</th>
                </tr>
              </thead>

              <tbody>
                {providerNetworks.map((provider) => (
                  <tr key={provider.id}>
                    <td>
                      <input
                        type="checkbox"
                        id={`provider_${provider.id}`}
                        checked={provider.allowAll}
                        onChange={() => {
                          setProviderNetworks((prev) =>
                            prev.map((p) =>
                              p.id === provider.id
                                ? { ...p, allowAll: !p.allowAll }
                                : p
                            )
                          );
                        }}
                      />
                    </td>
                    <td>{provider.name}</td>
                    <td>{provider.networkId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 가져올 네트워크 테이블 */}
        <div className="network-bring-table-outer">
          <span>가져올 네트워크</span>
          <div>
            <table className="network-new-cluster-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      id="select_all"
                      checked={networkList.every((network) => network.allowAll)}
                      onChange={handleSelectAllChange}
                    />
                  </th>
                  <th>이름</th>
                  <th>공급자의 네트워크 ID</th>
                  <th>${Localization.kr.DATA_CENTER}</th>
                  <th>
                    <div className="flex">
                      <input
                        type="checkbox"
                        id="allow_all"
                        checked={networkList.every((network) => network.allowAll)}
                        onChange={handleSelectAllChange}
                      />
                      <label htmlFor="allow_all"> 모두 허용</label>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {networkList.map((network) => (
                  <tr key={network.id}>
                    <td>
                      <input
                        type="checkbox"
                        id={`network_${network.id}`}
                        checked={network.allowAll}
                        onChange={() => handleCheckboxChange(network.id)}
                      />
                    </td>
                    <td>{network.name}</td>
                    <td>{network.networkId}</td>
                    <td>{network.dataCenter}</td>
                    <td>
                      <input
                        type="checkbox"
                        id={`allow_${network.id}`}
                        checked={network.allowAll}
                        onChange={() => handleCheckboxChange(network.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
 
    </BaseModal>
  );
};

export default NetworkImportModal;
