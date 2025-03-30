import React from "react";
import HeaderButton from "../../../components/button/HeaderButton";
import TableColumnsInfo from "../../../components/table/TableColumnsInfo";
import VmDupl from "../../../components/dupl/VmDupl";
import { rvi24Desktop } from "../../../components/icons/RutilVmIcons";
import { useAllVMs } from "../../../api/RQHook";
import Localization from "../../../utils/Localization";
import "./Vm.css";
import Logger from "../../../utils/Logger";

/**
 * @name AllVm
 * @description 가상머신
 *
 * @returns
 */
const AllVm = () => {
  const {
    data: vms = [],
    isLoading: isVmsLoading,
    isError: isVmsError,
    isSuccess: isVmsSuccess,
    refetch: vmsRefetch,
  } = useAllVMs((e) => ({ ...e }));

  Logger.debug("...");
  return (
    <div id="section">
      <HeaderButton titleIcon={rvi24Desktop()}
        title={Localization.kr.VM}
      />
      <div className="section-content w-full">
        <VmDupl columns={TableColumnsInfo.VMS}
          vms={vms}
          onCloseModal={vmsRefetch}
          showSearchBox={true}
          isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
        />
      </div>
    </div>
  );
};

export default AllVm;
