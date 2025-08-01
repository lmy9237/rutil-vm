import { useState } from "react";
import { useToast }  from "@/hooks/use-toast";
import useGlobal     from "@/hooks/useGlobal";
import Localization  from "@/utils/Localization";
import Logger        from "@/utils/Logger";

/**
 * @title useApiToast
 * @description API동작에서 발생하는 toast hook
 * 
 * @property {"} apiToast 토스트 모음
 * 
 * @returns {JSX.Element} useApiToast
 */
export const useApiToast = () => {
  const { toast } = useToast();

  const apiToast = {
    /**
     * @name apiToast.refetch(...)
     * @description 다시 받아오는 API 를 실행 할 떄
     * 
     * @param {string} description 내용
     */
    refetch: (
      description=Localization.kr.REFETCH_IN_PROGRESS
    ) => {
      Logger.debug(`useApiToast > apiToast.refetch ... description: ${description}`);
      toast({
        title: Localization.kr.TITLE_API_FETCH,
        description: description || "...",
        duration: 1200,
      })
    },
    /**
     * @name apiToast.ok(...)
     * @description API처리를 성공 할 떄
     * 
     * @param {string} description 내용
     */
    ok: (
      description=""
    ) => {
      Logger.debug(`useApiToast > apiToast.ok . .. description: ${description}`);
      toast({ // 개발 모드일 때만 이 Toast가 활성화
        variant: "success",
        title: Localization.kr.TITLE_API_SUCCESS,
        description: description || "...",
        duration: 2000,
      })
    },
    /**
     * @name apiToast.error(...)
     * @description API처리를 실패 할 떄
     * 
     * @param {string} message 내용
     */
    error: (
      message=""
    ) => {
      Logger.debug(`useApiToast > apiToast.error ... message: ${message}`);
      import.meta.env.DEV && toast({ // 개발 모드일 때만 이 Toast가 활성화
        variant: "destructive",
        title: Localization.kr.TITLE_API_ERROR,
        description: message || "...",
        duration: 2000,
      })
    }
  }
  return { apiToast }
}

export const useProgressToast = () => {
  const { toast, dismiss } = useToast();
  const {
    fileUploadQueue, 
    newFileUploadQueue,
    popFileUploadQueue
  } = useGlobal()

  const progressToast = {
    indefinite: (title, shouldEnd) => {
      Logger.debug(`useProgressToast > progressToast.indeifinite ... ${title}`);
      toast({
        title: title,
        description: "기다리는 중 ...", 
        // duration: shouldEnd ? 300 : Infinity,
        update: () => ({
          duration: shouldEnd ? 300 : Infinity,
        })
      })
    },
    in: (title, progress=0, loaded=0, total=0) => {
      /* if ([...fileUploadQueue].length == 0)
        newFileUploadQueue()
      for (let id of fileUploadQueue) {
        Logger.debug(`useProgressToast > validationToast.in ... progress: ${progress}, id: ${id}`);
        toast({
          id: id,
          title: title || `파일 ${Localization.kr.UPLOAD} ${Localization.kr.IN_PROGRESS}`,
          description: `${Localization.kr.UPLOAD} ${Localization.kr.IN_PROGRESS} ${progress}%`,
          update: () => ({
            duration: (progress === 100) ? 1 : Infinity
          }),
          duration: Infinity,
        });
        if (progress == 100) {
          popFileUploadQueue()
          dismiss()
        }
      } */
      
      Logger.debug(`useProgressToast > progressToast.in ... progress: ${progress}`);
      const ratio = `(${loaded} MB / ${total} MB)`
      toast({
        id: 1,
        title: title || `디스크이미지 ${Localization.kr.UPLOAD} 준비 ${Localization.kr.IN_PROGRESS}`,
        description: `${progress}% 완료 (${ratio})\n\n 창을 새로고침 하지 마세요.`,
        update: () => ({
          duration: (progress >= 99) ? 1 : Infinity
        }),
        duration: Infinity,
      });
      if (progress >= 99) {
        popFileUploadQueue()
        dismiss()
      }
    }
  }

  return { progressToast }
}

/**
 * @title useValidationToast
 * @description 값 검증 과정에서 발생하는 toast hook
 * 
 * @property {"} validationToast 토스트 모음
 * 
 * @returns {JSX.Element} useValidationToast
 */
export const useValidationToast = () => {
  const { toast } = useToast();

  const validationToast = {
    debug: (
      value="",
    ) => {
      Logger.debug(`useValidationToast > validationToast.debug ... value: ${value}`);
      toast({
        variant: "info",
        title: Localization.kr.TITLE_DEBUGGING,
        description: value || ""
      })
    }, 
    fail: (
      reason=""
    ) => {
      Logger.debug(`useValidationToast > validationToast.fail ... reason: ${reason}`);
      toast({
        variant: "destructive",
        title: Localization.kr.TITLE_SOMETHING_WENT_WRONG,
        description: reason || "..."
      })
    }
  }

  return { validationToast }
}