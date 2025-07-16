// 버튼 타입에 따라 분리
import ClusterActionButtons from "@/components/dupl/ClusterActionButtons";
import HostActionButtons from "@/components/dupl/HostActionButtons";
import NetworkActionButtons from "@/components/dupl/NetworkActionButtons";
import TemplateActionButtons from "@/components/dupl/TemplateActionButtons";
import VmActionButtons from "@/components/dupl/VmActionButtons";
import React from "react";

// 도메인별 액션 버튼 컴포넌트

// 필요 시 추가 import

/**
 * @name contextActionButtonMap
 * @description 각 테이블 row의 target에 따라 context menu에서 사용할 액션 버튼 컴포넌트를 매핑함
 */

export const contextActionButtonMap = {
  template: TemplateActionButtons,
  network: NetworkActionButtons,
  vm: VmActionButtons,
  host: HostActionButtons,
  cluster: ClusterActionButtons,
};

export default contextActionButtonMap;
