import React from "react";
import { Separator }                    from "@/components/ui/separator"
import { 
  Accordion, AccordionItem, AccordionTrigger, AccordionContent
} from "@/components/ui/accordion"
import {
  severity2Icon,
} from "@/components/icons/RutilVmIcons";
import "./SettingCertRenewalPolicies.css"
import Localization                     from "@/utils/Localization";

/**
 * @name SettingCertRenewalPolicies
 * @description 인증서 재갱신 정책
 * 
 * @returns {JSX.Element} SettingCertRenewalPolicies
 */
const SettingCertRenewalPolicies = () => {

  return (
    /*
    <details className="v-start w-full">
      <summary className="f-start fs-18 gap-2 w-full">
        <h2 
          className="f-start w-full"
        >{severity2Icon("WARNING", true)}인증서 재갱신 정책</h2>
      </summary>
      <Separator/>
      <ul>
        {[...Localization.kr.CERTIFICATE_GUIDES].map((e) => (<li>{e}</li>))}
      </ul>
    </details>
    */
    <Accordion type="single"
      collapsible
      className="f-start" defaultValue="item-1"
    >
    <AccordionItem value="item-1">
      <AccordionTrigger className="f-start mb-2">
        {severity2Icon("WARNING", true)}
        <span className="mx-1">인증서 재갱신 정책</span>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-4 text-balance">
        <ul>
        {[...Localization.kr.CERTIFICATE_GUIDES].map((e) => (<li>{e}</li>))}
        </ul>
      </AccordionContent>
    </AccordionItem>
    </Accordion>
  );
};

export default SettingCertRenewalPolicies;