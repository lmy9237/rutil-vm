import { useToast }  from "@/hooks/use-toast";
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
        description: description || "..."
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
      Logger.debug(`useApiToast > apiToast.ok ... description: ${description}`);
      import.meta.env.DEV && toast({ // 개발 모드일 때만 이 Toast가 활성화
        variant: "success",
        title: Localization.kr.TITLE_API_SUCCESS,
        description: description || "..."
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
        description: message || "..."
      })
    }
  }
  return { apiToast }
}

export const useProgressToast = () => {
  const { toast, dismiss } = useToast();

  const progressToast = {
    in: (title, progress=0) => { 
      Logger.debug(`useProgressToast > validationToast.in ... progress: ${progress}`);
      toast({
        id: 1,
        title: title || `파일 ${Localization.kr.UPLOAD} ${Localization.kr.IN_PROGRESS}`,
        description: `${Localization.kr.UPLOAD} ${Localization.kr.IN_PROGRESS} ${progress}%`,
        update: () => ({
          duration: (progress === 100) ? 1 : Infinity
        }),
        duration: Infinity,
      });
      if (progress == 100) dismiss()
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