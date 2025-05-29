import { useToast }  from "@/hooks/use-toast";
import Localization  from "@/utils/Localization";
import Logger        from "@/utils/Logger";

/**
 * @title useApiToast
 * @description API동작에서 발생하는 toast hook
 * 
 * @returns {JSX.Element} useApiToast
 */
export const useApiToast = () => {
  const { toast } = useToast();

  const refetch = (description=Localization.kr.REFETCH_IN_PROGRESS) => {
    Logger.debug(`useApiToast > apiToast.inProgress ... description: ${description}`);
    toast({
      title: Localization.kr.TITLE_API_FETCH,
      description: description || "..."
    })
  }

  const ok = (description="") => {
    Logger.debug(`useApiToast > apiToast.ok ... description: ${description}`);
    toast({
      variant: "success",
      title: Localization.kr.TITLE_API_SUCCESS,
      description: description || "..."
    })
  }

  const error = (message="") => {
    Logger.debug(`useApiToast > apiToast.error ... message: ${message}`);
    toast({
      variant: "destructive",
      title: Localization.kr.TITLE_API_ERROR,
      description: message || "..."
    })
  }

  const apiToast = {
    refetch,
    ok,
    error,
  }

  return { 
    apiToast
  }
}

/**
 * @title useValidationToast
 * @description 값 검증 과정에서 발생하는 toast hook
 * 
 * @returns {JSX.Element} useValidationToast
 */
export const useValidationToast = () => {
  const { toast } = useToast();

  const fail = (reason="") => {
    Logger.debug(`useApiToast > validationToast.fail ... reason: ${reason}`);
    toast({
      variant: "destructive",
      title: Localization.kr.TITLE_SOMETHING_WENT_WRONG,
      description: reason || "..."
    })
  }

  const validationToast = {
    fail,
  }

  return {
    validationToast
  }
}