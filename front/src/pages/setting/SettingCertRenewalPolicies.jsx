import React from "react";
import {
  severity2Icon,
} from "@/components/icons/RutilVmIcons";
import "./SettingCertRenewalPolicies.css"
import Localization from "@/utils/Localization";

/**
 * @name SettingCertRenewalPolicies
 * @description 인증서 재갱신 정책
 * 
 * @returns {JSX.Element} SettingCertRenewalPolicies
 */
const SettingCertRenewalPolicies = () => {

  return (
    <details className="v-start w-full">
      <summary className="f-start fs-18 gap-2 w-full">
        <h2 
          className="f-start w-full"
        >{severity2Icon("WARNING", true)}인증서 재갱신 정책</h2>
      </summary>
      <hr/>
      <ul>
        {[...Localization.kr.CERTIFICATE_GUIDES].map((e) => (<li>{e}</li>))}
      </ul>
    </details>
  );
};

export default SettingCertRenewalPolicies;
