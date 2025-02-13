import { useState } from "react";
import { faChevronCircleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const VmInit = ({
  editMode,
  formCloudInitState,
  setFormCloudInitState,
}) => {
  // 새로만들기->초기실행 화살표 누르면 밑에열리기
  const [isDomainHiddenBoxVisible, setDomainHiddenBoxVisible] = useState(false);
  const toggleDomainHiddenBox = () => {
    setDomainHiddenBoxVisible(!isDomainHiddenBoxVisible);
  };

  return (
    <>
      <div className="p-1.5">
        <div className="flex mb-1.5">
          <input
            type="checkbox"
            id="enableBootMenu"
            name="enableBootMenu"
            checked={formCloudInitState.cloudInit} // cloudInit 상태를 checked 속성에 바인딩
            onChange={(e) => {
              const isChecked = e.target.checked;
              setFormCloudInitState((prev) => ({
                ...prev,
                cloudInit: isChecked, // cloudInit 상태 업데이트
                script: isChecked ? prev.script : "", // 체크 해제 시 script 초기화
              }));
              if (!isChecked) {
                setDomainHiddenBoxVisible(false); // 체크 해제 시 숨김 박스도 닫기
              }
            }}
          />
          <label htmlFor="enableBootMenu">Cloud-lnit</label>
        </div>

        {formCloudInitState.cloudInit && (
          <div>
            <FontAwesomeIcon
              icon={faChevronCircleRight}
              id="domain_hidden_box_btn2"
              onClick={toggleDomainHiddenBox}
              fixedWidth
            />
            <span>사용자 지정 스크립트</span>
            <div
              className="mt-0.5"
              id="domain_hidden_box2"
              style={{ display: "block" }} // 상태에 따라 표시 여부 제어
            >
              <textarea
                name="content"
                cols="40"
                rows="8"
                placeholder="여기에 스크립트를 입력하세요"
                value={formCloudInitState.script} // script 상태와 바인딩
                onChange={(e) =>
                  setFormCloudInitState((prev) => ({
                    ...prev,
                    script: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default VmInit;