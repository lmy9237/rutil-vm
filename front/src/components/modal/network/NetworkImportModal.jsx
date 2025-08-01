import React, { useEffect, useState } from "react";
import { useValidationToast }           from "@/hooks/useSimpleToast";
import useGlobal                        from "@/hooks/useGlobal";
import BaseModal                        from "@/components/modal/BaseModal";
import TablesOuter                      from "@/components/table/TablesOuter";
import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import {
  handleInputChange, 
  handleSelectIdChange,
} from "@/components/label/HandleInput";
import { 
  RVI24, 
  rvi24ChevronDown, 
  rvi24ChevronUp, 
  rvi24DownArrow
} from "@/components/icons/RutilVmIcons";
import {
  useAllNetworkProviders,
  useAllNetworksFromNetworkProvider,
} from "@/api/RQHook";
import Localization                     from "@/utils/Localization";
import "./MNetwork.css";

const NetworkImportModal = ({
  isOpen,
  onClose,
  onSubmit 
}) => {
  const { validationToast } = useValidationToast();
  const {
    networkProvidersSelected, setNetworkProvidersSelected
  } = useGlobal()
  const [networkProviderVo, setNetworkProviderVo] = useState({ id: "", name: "" })

  const {
    data: networkProviders = [] ,
    isLoading: isNetworkProvidersLoading,
    isSuccess: isNetworkProvidersSuccess
  } = useAllNetworkProviders((e) => ({ ...e }));

  const transformedNetworkProviders = [...networkProviders].filter(np => !!np?.id).map((np) => ({
    ...np
  }));

  const {
    data: providerNetworks = [],
    isLoading: isProviderNetworksLoading,
    isSuccess: isProviderNetworksSuccess,
    isRefetching: isProviderNetworksRefetching,
    isError: isProviderNetworksError,
  } = useAllNetworksFromNetworkProvider(networkProviderVo?.id, (e) => ({ 
    ...e
  }), (err) => {
    Logger.err(`NetworkImportModal > useAllNetworksFromNetworkProvider ... Error Fetching!`)
    throw err
  });

  // 임시 컬럼
  const providerNetworkColumns = [
    {
      accessor: "select",
      header: (
        <input
          type="checkbox"
          id="provider_select_all"
          onChange={() => {
            const allSelected = providerNetworks.every((p) => p.selected);
            setProviderNetworks((prev) =>
              prev.map((p) => ({ ...p, selected: !allSelected }))
            );
          }}
        />
      ),
      width: "50px",
      cell: (row) => (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={row.selected}
            onChange={() => {
              setProviderNetworks((prev) =>
                prev.map((p) =>
                  p.id === row.id ? { ...p, selected: !p.selected } : p
                )
              );
            }}
          />
        </div>
      ),
    },
    { accessor: "name", header: "이름" },
    { accessor: "networkId", header: "공급자의 네트워크 ID" },
  ];  
  const importNetworkColumns = [
    {
      accessor: "select",
      header: (
        <input
          type="checkbox"
          id="import_select_all"
          onChange={() => {
            const allSelected = networkList.every((n) => n.selected);
            setNetworkList((prev) =>
              prev.map((n) => ({ ...n, selected: !allSelected }))
            );
          }}
        />
      ),
      width: "50px",
      cell: (row) => (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={row.selected}
            onChange={() => {
              setNetworkList((prev) =>
                prev.map((n) =>
                  n.id === row.id ? { ...n, selected: !n.selected } : n
                )
              );
            }}
          />
        </div>
      ),
    },
    { accessor: "name", header: "이름" },
    { accessor: "networkId", header: "공급자의 네트워크 ID" },
    { accessor: "dataCenter", header: "데이터 센터" },
    {
      accessor: "allowAll",
      header: (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="allow_all"
            onChange={() => {
              const allAllowed = networkList.every((n) => n.allowAll);
              setNetworkList((prev) =>
                prev.map((n) => ({ ...n, allowAll: !allAllowed }))
              );
            }}
          />
          <label htmlFor="allow_all" className="ml-1">모두 허용</label>
        </div>
      ),
      width: "50px",
      cell: (row) => (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={row.allowAll}
            onChange={() => {
              setNetworkList((prev) =>
                prev.map((n) =>
                  n.id === row.id ? { ...n, allowAll: !n.allowAll } : n
                )
              );
            }}
          />
        </div>
      ),
    },
  ];

  const [networkList, setNetworkList] = useState([
    /* {
      id: "network_1",
      name: "서울 VM 네트워크",
      networkId: "IM-NET-101",
      dataCenter: "DC-Seoul",
      allowAll: false,
      selected: false,
    }, {
      id: "network_2",
      name: "부산 DB 네트워크",
      networkId: "IM-NET-102",
      dataCenter: "DC-Busan",
      allowAll: true,
      selected: true,
    }, {
      id: "network_3",
      name: "테스트 백업망",
      networkId: "IM-NET-103",
      dataCenter: "DC-Test",
      allowAll: false,
      selected: false,
    }, */
  ]);

  useEffect(() => {
    if (networkProviders.length > 0) {
      setNetworkProvidersSelected(networkProviders[0])
      setNetworkProviderVo((prev) => ({ 
        ...prev, 
        id: networkProviders[0]?.id || "",
        name: networkProviders[0]?.name || "",
      }))
    }
  }, [networkProviders])
  
  return (
    <BaseModal targetName={Localization.kr.NETWORK} submitTitle={Localization.kr.IMPORT}
      isOpen={isOpen} onClose={onClose}
      onSubmit={onSubmit}
      isReady={!isNetworkProvidersLoading && isNetworkProvidersSuccess}
      contentStyle={{ width: "880px" }} 
    >
      {/* 네트워크 공급자 목록 */}
      <LabelSelectOptionsID label={Localization.kr.NETWORK_PROVIDER} value={networkProviderVo.id}
        disabled={isNetworkProvidersLoading}
        loading={isNetworkProvidersLoading}
        options={[...transformedNetworkProviders]}
        onChange={handleSelectIdChange(setNetworkProviderVo, networkProviders, validationToast)}
      />
      {/* 공급자 네트워크 테이블 */}
      <div className="network-bring-table-outer">
        <h1 className="font-bold fs-14 mb-3">공급자 네트워크</h1>
        <TablesOuter target={"providerNetwork"}
          columns={providerNetworkColumns}
          data={providerNetworks}
          onRowClick={(selectedRows) => {
            /* if (activeModal().length > 0 || activeModal().includes("vm:migration")) return
            setVmsSelected(selectedRows) */
          }}
          isRefetching={isProviderNetworksRefetching} isLoading={isProviderNetworksLoading} isError={isProviderNetworksError} isSuccess={isProviderNetworksSuccess}
        />
      </div>

      <div className="f-center py-2">
        <RVI24 iconDef={rvi24ChevronUp()} className="mr-3" />
        <RVI24 iconDef={rvi24ChevronDown()}  />
      </div>

      {/* 가져올 네트워크 테이블 */}
      <div className="network-bring-table-outer mb-4">
        <h1 className="font-bold fs-14 mb-3">가져올 네트워크</h1>
        <TablesOuter
          target={"network"}
          columns={importNetworkColumns}
          data={networkList}
        />
      </div>
    </BaseModal>
  );
};

export default NetworkImportModal;
