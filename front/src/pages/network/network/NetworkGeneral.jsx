import { useNetworkById } from "../../../api/RQHook";

/**
 * @name NetworkGeneral
 * @description 네트워크 일반정보
 *
 * @prop {string} networkId 네트워크 ID
 * @returns {JSX.Element} NetworkGeneral
 */
const NetworkGeneral = ({ networkId }) => {
  const { data: network } = useNetworkById(networkId);

  const tableRows = [
    { label: "이름", value: network?.name },
    { label: "ID", value: network?.id },
    { label: "설명", value: network?.description },
    { label: "VDSM 이름", value: network?.vdsmName },
    {
      label: "가상 머신 네트워크",
      value: network?.usage?.vm ? "예" : "아니요",
    },
    { label: "VLAN 태그", value: network?.vlan === 0 ? "없음" : network?.vlan },
    {
      label: "MTU",
      value: network?.mtu === 0 ? "기본값 (1500)" : network?.mtu,
    },
  ];

  return (
    <table className="table">
      <tbody>
        {tableRows.map((row, index) => (
          <tr key={index}>
            <th>{row.label}:</th>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default NetworkGeneral;
