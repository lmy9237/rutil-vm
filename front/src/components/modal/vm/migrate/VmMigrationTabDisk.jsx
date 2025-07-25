import LabelSelectOptionsID             from "@/components/label/LabelSelectOptionsID";
import { checkZeroSizeToGiB } from "@/util";
import Localization from "@/utils/Localization";

const VmMigrationTabDisk = ({ 
  diskList, 
  domainList, 
  targetDomains, setTargetDomains, 
}) => (
  <>
    <div className="py-3">
      <div className="section-table-outer">
        <table>
          <thead>
            <tr>
              <th>{Localization.kr.ALIAS}</th>
              <th>{Localization.kr.SIZE_VIRTUAL}</th>
              <th>현재 {Localization.kr.DOMAIN}</th>
              <th>{Localization.kr.TARGET} {Localization.kr.DOMAIN}</th>
            </tr>
          </thead>
          <tbody>
            {diskList.length > 0 ? (
              diskList?.map((disk, index) => {
                const image = disk?.diskImageVo;
                if (!image) return null; // 혹은 빈 <tr>이라도

                return (
                  <tr key={disk.id || index}>
                    <td>{image.alias}</td>
                    <td>{checkZeroSizeToGiB(image?.virtualSize)}</td>
                    <td>{image.storageDomainVo?.name || ""}</td>
                    <td className="w-[230px]">
                      <LabelSelectOptionsID className="w-full"
                        value={targetDomains[disk.id] || ""}
                        options={domainList[disk.id] || []}
                        onChange={(selected) => {
                          setTargetDomains((prev) => ({ ...prev, [disk.id]: selected.id }));
                        }}
                      />
                      {targetDomains[disk.id] && (() => {
                        const domainObj = (domainList[disk.id] || []).find((d) => d.id === targetDomains[disk.id]);
                        if (!domainObj) return null;
                        return (
                          <div className="text-xs text-gray-500 f-end">
                            사용 가능: {checkZeroSizeToGiB(domainObj.availableSize)} {" / "} 총 용량: {checkZeroSizeToGiB(domainObj.availableSize + domainObj.usedSize)}
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
              )})
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </>
);
export default VmMigrationTabDisk;