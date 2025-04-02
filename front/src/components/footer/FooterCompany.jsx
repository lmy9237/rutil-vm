import React from "react";
import "./FooterCompany.css"
import { ItitinfoLogoIcon } from "../icons/RutilVmIcons";

const FooterCompany = ({
  isBrief=true,
}) => {
  const items = [
    "아이티정보기술(주)", "대표: 박용정", "경기 과천시 과천대로7길 33 (갈현동) B동 506호 디테크타워",
    "고객센터 070-4150-6989", "사업자등록번호 528-87-00686"
  ];
  const copyright = "Copyright 아이티정보기술㈜. All rights reserved."
  
  return (
    <div className="footer-company f-center w-full">
      {!isBrief && <ItitinfoLogoIcon  />}
      <div className="footer-company-group v-start">
        {!isBrief && <ul className="footer-company-detail">
          {items.map((e) => (<li className="detail-item">{e}</li>))}
        </ul>}
        <span id="footer-company-copyright"
          className="footer-company-detail detail-item"
        >
          {copyright}
        </span>
      </div>
    </div>
  );
}

export default FooterCompany;
