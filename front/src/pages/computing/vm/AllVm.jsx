import React from "react";
import SectionLayout          from "@/components/SectionLayout";
import HeaderButton           from "@/components/button/HeaderButton";
import TableColumnsInfo       from "@/components/table/TableColumnsInfo";
import VmDupl                 from "@/components/dupl/VmDupl";
import { rvi24Desktop }       from "@/components/icons/RutilVmIcons";
import {
  useAllVMs
} from "@/api/RQHook";
import Localization           from "@/utils/Localization";
import "./Vm.css";

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
    refetch: refetchVms,
    isRefetching: isVmsRefetching,
  } = useAllVMs((e) => ({ ...e }));

  return (
    <SectionLayout>
      <HeaderButton titleIcon={rvi24Desktop()}
        title={Localization.kr.VM}
      />
      <div className="section-content v-start gap-8 w-full">
        <VmDupl columns={TableColumnsInfo.VMS}
          vms={vms}
          refetch={refetchVms} isRefetching={isVmsRefetching}
          isLoading={isVmsLoading} isError={isVmsError} isSuccess={isVmsSuccess}
        />
      </div>
    </SectionLayout>
  );
};

export default AllVm;

