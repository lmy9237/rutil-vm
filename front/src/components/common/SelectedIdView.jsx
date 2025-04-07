import { useEffect } from "react";
import Logger from "../../utils/Logger";

/**
 * @name SelectedIdView
 * 
 * @param {Array} items 목록
 * @returns {JSX.Element} ID표출 뷰
 */
const SelectedIdView = ({ 
  items=[],
}) => {
  const selectedIds = (Array.isArray(items) ? items : [])
    .map((e) => e.id)
    .join(", ");
  
  const copyText = async (txt) => {
    Logger.debug(`SelectedIdView > copyText ... txt: ${txt}`)
    await navigator.clipboard.writeText(txt).catch((e) => {
      Logger.error(`something went WRONG ... reason: ${e.message}`)
    });
  }

  useEffect(() => {
    import.meta.env.DEV && copyText(selectedIds) // 개발 일 때만 활성화
  }, [items])
  Logger.debug(`SelectedIdView ... import.meta.env.DEV: ${import.meta.env.DEV}`)
  
  return (
    <>
      {import.meta.env.DEV && <span className="selected-ids">{selectedIds.length === 0 ? "선택된 ID가 없습니다" : `ID: ${selectedIds}`}</span>} {/* TODO: DEV일 때만 표출 하도록 */}
    </>
  )
}

export default SelectedIdView
