import React from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import TableColumnsInfo from "../../components/table/TableColumnsInfo";
import TablesOuter from "../../components/table/TableOuter";
import Logger from "../../utils/Logger";
import "./css/Permission.css";

const Permission = ({ isOpen, onRequestClose }) => {
  const permissionData = [
    {
      icon: "3204",
      name: "admin",
      description: "internal-authz",
    },
  ];
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="사용자에게 권한 추가"
      className="power_add"
      overlayClassName="power_add_outer"
      shouldCloseOnOverlayClick={false}
    >
      <div className="popup_header">
        <h1>사용자에게 권한 추가</h1>
        <button onClick={onRequestClose}>
          <FontAwesomeIcon icon={faTimes} fixedWidth />
        </button>
      </div>

      <div className="power-radio-group">
        <input type="radio" id="user" name="option" defaultChecked />
        <label htmlFor="user">사용자</label>

        <input type="radio" id="group" name="option" />
        <label htmlFor="group">그룹</label>

        <input type="radio" id="all" name="option" />
        <label htmlFor="all">모두</label>

        <input type="radio" id="my_group" name="option" />
        <label htmlFor="my_group">내 그룹</label>
      </div>

      <div className="power_contents_outer">
        <div>
          <label htmlFor="search">검색:</label>
          <select id="search">
            <option value="default">Default</option>
          </select>
        </div>
        <div>
          <label htmlFor="namespace">네임스페이스:</label>
          <select id="namespace">
            <option value="default">Default</option>
          </select>
        </div>
        <div>
          <label htmlFor="placeholder" style={{ color: "white" }}>
            .
          </label>
          <select id="placeholder">
            <option value="default">Default</option>
          </select>
        </div>
        <div>
          <div style={{ color: "white" }}>.</div>
          <input type="submit" value="검색" />
        </div>
      </div>

      <TablesOuter
        columns={TableColumnsInfo.PERMISSIONS}
        data={permissionData}
        onRowClick={() => Logger.debug("Row clicked")}
      />

      <div className="power_last_content">
        <label htmlFor="assigned_role">할당된 역할:</label>
        <select id="assigned_role" style={{ width: "65%" }}>
          <option value="default">UserRole</option>
        </select>
      </div>

      <div className="edit_footer">
        <button style={{ display: "none" }}></button>
        <button>OK</button>
        <button onClick={onRequestClose}>취소</button>
      </div>
    </Modal>
  );
};

export default Permission;
