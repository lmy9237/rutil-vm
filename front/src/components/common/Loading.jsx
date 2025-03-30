import React from 'react'

import "./Loading.css"
import Logger from '../../utils/Logger'

const Loading = () => {
  Logger.debug("...")
  return (
    <span>🌀 로딩중 ...</span>
  )
}

export default Loading