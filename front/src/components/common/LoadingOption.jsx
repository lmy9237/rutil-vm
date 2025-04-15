import React from 'react'
import Localization from "../../utils/Localization";

const LoadingOption = () => {
  return (
    <option>{Localization.kr.LOADING}{Localization.kr.IN_PROGRESS}</option>
  )
}

export default LoadingOption