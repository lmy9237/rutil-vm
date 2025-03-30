import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BaseModal from "./modal/BaseModal";
import {
  useDeleteDataCenter,
  useDeleteCluster,
  useDeleteHost,
  useDeleteTemplate,
  useDeleteNetwork,
  useDeleteVnicProfile,
  useDeleteNetworkInterface,
  useDeleteDisk,
  useDeleteNetworkFromTemplate,
  useDeleteSnapshot,
  useDeleteDiskFromVM,
} from "../api/RQHook";
import { RVI24, rvi24ErrorRed } from "./icons/RutilVmIcons";
import Logger from "../utils/Logger";
import toast from "react-hot-toast";

const DeleteModals = ({
  isOpen,
  type,
  onRequestClose,
  contentLabel,
  data,
  networkId, // 외부에서 전달된 prop TODO 바꿔야함
  vmId,
  templateId,
}) => {
  const [id, setId] = useState([]);
  const [name, setName] = useState([]);

  const { mutate: deleteDataCenter } = useDeleteDataCenter();
  const { mutate: deleteCluster } = useDeleteCluster();
  const { mutate: deleteHost } = useDeleteHost();
  const { mutate: deleteTemplate } = useDeleteTemplate();
  const { mutate: deleteNetwork } = useDeleteNetwork();
  const { mutate: deleteVnicProfile } = useDeleteVnicProfile();
  const { mutate: deleteNetworkInterface } = useDeleteNetworkInterface();
  const { mutate: deleteNicFromTemplate } = useDeleteNetworkFromTemplate();
  const { mutate: deleteDisk } = useDeleteDisk();
  const { mutate: deleteSnapshot } = useDeleteSnapshot();
  const { mutate: deleteDiskFromVM } = useDeleteDiskFromVM();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (data) {
      if (Array.isArray(data)) {
        // data가 배열인 경우
        setId(data.map((item) => item.id));
        setName(data.map((item) => item.name || item.alias || "").join(", "));
      } else {
        // data가 단일 객체인 경우
        setId([data.id]);
        setName([data.name || data.alias || ""]);
      }
    }
  }, [data]);

  useEffect(() => {
    Logger.debug("DeleteModal:", data, +id);
  }, [data, id]);

  const handleFormSubmit = () => {
    if (!id) {
      const msg = `ID가 없습니다. 삭제 요청을 취소합니다.`;
      Logger.error(`DeleteModal > handleFormSubmit ... ${msg}`);
      toast.error(msg)
      return;
    }
    Logger.debug(`DeleteModal > handleFormSubmit ... type: ${type}`);
    const _type = type.toLowerCase();
    switch(_type) {
    case "datacenter": 
      Logger.debug(`DeleteModal > handleFormSubmit ... DataCenter 삭제`);
      id.forEach((datacenterId, index) => {
        handleDelete(() => deleteDataCenter(datacenterId), name[index]);
      });
      onRequestClose();break;
    case "cluster":
      Logger.debug(`DeleteModal > handleFormSubmit ... Cluster 삭제`);
      id.forEach((clsuterId, index) => {
        handleDelete(() => deleteCluster(clsuterId), name[index]);
      });
      onRequestClose();break;
    case "host":
      Logger.debug(`DeleteModal > handleFormSubmit ... Host 삭제`);
      id.forEach((hostId, index) => {
        handleDelete(() => deleteHost(hostId), name[index]);
      });
      onRequestClose();break;
    case "template":
      Logger.debug(`DeleteModal > handleFormSubmit ... Template 삭제`);
      id.forEach((templateId, index) => {
        handleDelete(() => deleteTemplate(templateId), name[index]);
      });
      onRequestClose();break;
    case "network":
      Logger.debug(`DeleteModal > handleFormSubmit ... Network 삭제`);
      id.forEach((networkId, index) => {
        handleDelete(() => deleteNetwork(networkId), name[index]);
      });
      onRequestClose();break;
    case "vnicprofile":
      Logger.debug(`DeleteModal > handleFormSubmit ... vNic Profile 삭제`);
      id.forEach((vnicProfileId, index) => {
        handleDelete(() => deleteVnicProfile(vnicProfileId), name[index]);
      });
      onRequestClose();break;
    case "networkinterface":
      Logger.debug(`DeleteModal > handleFormSubmit ... NetworkInterface 삭제`);
      handleDelete(() => deleteNetworkInterface({ vmId, nicId: id }));
      /*id.forEach((nicId, index) => {
        handleDelete(() => deleteNetworkInterface({ vmId, nicId: id }));
      })*/
      onRequestClose();break;
    case "networkinterfacefromtemplate":
    case "templatenic":
      Logger.debug(`DeleteModal > handleFormSubmit ... NicFromTemplate 삭제`);
      id.forEach((nicId) => {
        handleDelete(() => deleteNicFromTemplate({ templateId, nicId }));
      });
      onRequestClose();break;
    case "disk":
      Logger.debug(`DeleteModal > handleFormSubmit ... Disk 삭제`);
      id.forEach((diskkId, index) => {
        handleDelete(() => deleteDisk(diskkId), name[index]); // 각 네트워크를 개별적으로 삭제
      });
      onRequestClose();break;
    case "snapshot":
      Logger.debug(`DeleteModal > handleFormSubmit ... Snapshot 삭제`);
      id.forEach((snapshotId, index) => {
        handleDelete(() => deleteSnapshot({ vmId, snapshotId }));
      });
      onRequestClose();break;
    case "vmdisk":
      Logger.debug("Deleting vmDisk");
      handleDelete(() => deleteDiskFromVM({ vmId, diskAttachmentId: id }));
      onRequestClose();break;
    default: onRequestClose();break;
    }    
  };

  const handleDelete = (deleteFn = () => {}) => {
    deleteFn(id, {
      onSuccess: () => {
        if (type === "DataCenter") {
          // Datacenter 삭제 후 특정 경로로 이동
          navigate("/computing/rutil-manager/datacenters");
        } else if (type === "Cluster") {
          // Datacenter 삭제 후 특정 경로로 이동
          navigate("/computing/rutil-manager/clusters");
        } else if (type === "Host") {
          // Datacenter 삭제 후 특정 경로로 이동
          navigate("/computing/rutil-manager/hosts");
        } else {
          // 다른 타입일 경우 기본 동작 수행
          const currentPath = location.pathname;
          if (currentPath.includes(id)) {
            const newPath = currentPath.replace(`/${id}`, "");
            navigate(newPath);
          } else {
            window.location.reload();
          }
        }
        onRequestClose(); // 삭제 성공 시 모달 닫기
      },
      onError: (error) => {
        Logger.error(`${contentLabel} ${name} 삭제 오류:`, error);
      },
    });
  };

  return (
    <BaseModal isOpen={true} onClose={onRequestClose}
      contentLabel={`${contentLabel}`}
      targetName={contentLabel}
      submitTitle={"삭제"}
      onSubmit={handleFormSubmit}
    >
      <div className="disk-delete-box">
        <RVI24
          className="error-icon"
          iconDef={rvi24ErrorRed}
        />
        <span>&nbsp;{name} 를(을) 삭제하시겠습니까?&nbsp;</span>
      </div>
    </BaseModal>
  );
};

export default DeleteModals;
