import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import "./NavButton.css";

const NavButton = React.memo(({ 
  sections,
  handleSectionClick,  
}) => {
  const { pathname } = useLocation(); // 현재 URL 경로 가져오기
  const [activeSection, setActiveSection] = useState(sections[0]?.id || ""); // 기본값을 첫 번째 섹션으로 설정

  useEffect(() => {
    const pathParts = pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];

    // URL이 변경될 때 첫 번째 요소를 active 상태로 설정
    if (sections.some((section) => section.id === lastPart)) {
      setActiveSection(lastPart);
    } else {
      setActiveSection(sections[0]?.id || ""); // URL에 맞는 섹션이 없으면 첫 번째 섹션을 기본으로 설정
    }
  }, [pathname, sections]); // pathname 또는 sections가 변경될 때마다 실행

  const handleClick = useCallback((sectionId) => {
    setActiveSection(sectionId);
    handleSectionClick(sectionId);
  }, [handleSectionClick]);

  return (
    <div className="content-header">
        {sections.map((section) => (
          <span key={section.id}
            className={`f-start ${activeSection === section.id ? "active fw-500" : ""}`}
            onClick={() => handleClick(section.id)}
          >
            {section.label}
          </span>
        ))}
      <div className="content-header-left ">
      </div>
    </div>
  );
});

export default NavButton;
