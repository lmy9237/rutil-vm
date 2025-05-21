import React, { useEffect, useCallback, useMemo } from "react";
import useCopyToClipboard from "@/hooks/useCopyToClipboard";
import Logger from "@/utils/Logger";

/**
 * @name SelectedIdView
 * @description 선택된 항목의 ID 표출 (개발용)
 *  
 * @param {Array} items 목록
 * @returns {JSX.Element} ID표출 뷰
 */
const SelectedIdView = ({ 
  items=[],
}) => {
  const selectedIds = useMemo(() => (
    [...items]
      .map((e) => e?.id ?? e?.username)
      .join(", ")
  ), [items])
  const [copied, copy] = useCopyToClipboard(selectedIds)

  useEffect(() => {
    Logger.debug(`SelectedIdView > useEffect ... items: `, items)
    import.meta.env.DEV && copy() // 개발 일 때만 활성화
  }, [items])
  
  return (
    <>
      {import.meta.env.DEV && <span className="selected-ids fs-8">{selectedIds.length === 0 ? "선택된 ID가 없습니다" : `ID: ${selectedIds}`}</span>} {/* TODO: DEV일 때만 표출 하도록 */}
    </>
  )
}

export default React.memo(SelectedIdView)
