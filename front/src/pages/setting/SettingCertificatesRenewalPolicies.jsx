import React from "react";
import {
  severity2Icon,
} from "../../components/icons/RutilVmIcons";
import "./SettingCertificatesRenewalPolicies.css"

/**
 * @name SettingCertificatesRenewalPolicies
 * @description 인증서 재갱신 정책
 * 
 * @returns {JSX.Element} SettingCertificatesRenewalPolicies
 */
const SettingCertificatesRenewalPolicies = () => {
  const msgs = [
    "RutilVM automatically requires the renewal of certificates that are set to expire within 30 days.",
    "If the engine-setup command is executed within 30 days before the expiration date, the PKI CONFIGURATION stage will be activated.",
    "If more than 30 days remain before the expiration date, the PKI stage will be skipped when running the engine-setup command.",
    "oVirt checks the expiration date of both the existing CA certificate and the server certificate. If either certificate is set to expire within 30 days, renewal is required.",
    "Failure to renew the certificates may result in the inability to access the web interface and disruption of certain services, so it is crucial to renew them in advance.",
  ];

  return (
    <details className="v-start w-full">
      <summary className="f-start fs-18 gap-2 w-full">
        <h2 
          className="f-start w-full"
        >{severity2Icon("WARNING", true)}인증서 재갱신 정책</h2>
      </summary>
      <hr/>
      <ul>
        {[...msgs].map((e) => (<li>{e}</li>))}
      </ul>
    </details>
  );
};

export default SettingCertificatesRenewalPolicies;
