const NicToolTip = (nic) => { 

  return `
    <div style="text-align: left;">
      <strong>MAC:</strong> ${nic.macAddress || "없음"}<br/>
      <strong>Rx 속도:</strong> ${nic.rxSpeed || "0"} Mbps<br/>
      <strong>총 Rx:</strong> ${nic.rxTotalSpeed || "0"} 바이트<br/>
      <strong>Tx 속도:</strong> ${nic.txSpeed || "0"} Mbps<br/>
      <strong>총 Tx:</strong> ${nic.txTotalSpeed || "0"} 바이트<br/>
      <strong>${nic.speed || "0"}Mbps / ${nic.pkts || "0 Pkts"}<br/>
    </div>
  `;
};

export default NicToolTip;
