import { useCallback, useEffect, useState } from "react";
import Logger                 from "@/utils/Logger";

const useCopyToClipboard = (txt) => {
  const copyToClipboard = useCallback(async (txt) => {
    Logger.debug(`useCopyToClipboard > copyToClipboard ... txt: ${txt}`)
    await navigator.clipboard.writeText(txt).catch((e) => {
      Logger.error(`useCopyToClipboard > copyToClipboard ... something went WRONG! reason: ${e.message}`)
      return false
    });
    return true
  }, [txt])

  const [copied, setCopied] = useState(false)
  const copy = useCallback(async () => {
    Logger.debug(`useCopyToClipboard > copy ... txt: ${txt}, copied: ${copied}`)
    if (!copied) setCopied(await copyToClipboard(txt));
  }, [copied, txt])

  useEffect(() => 
    () => setCopied(false)
  , [txt]);

  return [copied, copy];
};

export default useCopyToClipboard;
