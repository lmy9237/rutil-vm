import React, { useCallback, useMemo } from "react";
import CONSTANT from "@/Constants";
import { ActionButtons } from "@/components/button/ActionButtons";
import { RVI16, rvi16Globe } from "@/components/icons/RutilVmIcons";
import "./OVirtWebAdminHyperlink.css"

/**
 * @name OVirtWebAdminHyperlink
 * @description 관련페이지의 oVirt 참고 링크 (개발용)
 * 
 * @param {string} pageName 페이지 설명
 * @param {string} local Locale 값
 * @param {string} path (oVirt) 페이지 링크ID
 * @returns 
 */
const OVirtWebAdminHyperlink = ({
  name="링크참고",
  path="dashboard-main"
}) => {
  const _pageName = (
    <>
      <p className="f-start"><RVI16 iconDef={rvi16Globe("currentColor")}/>{name}</p>
      <br/>
      <p>(#{path})</p>
    </>
  )
  const fullPath = useCallback((locale) => { 
    const baseUrl = CONSTANT.baseUrl === 'localhost'
      ? '192.168.0.20'
      : CONSTANT.baseUrl
    /*const baseUrl = (CONSTANT.baseUrl === 'localhost')
      ? ''
      : CONSTANT.baseUrl;*/
    return `https://${baseUrl}:8443/ovirt-engine/webadmin/?locale=${locale}#${path}`
  }, [name, path])
  const locales = useMemo(() => [{
    name: "한글", locale: "ko_KR",
  }, {
    name: "영어", locale: "en_US",
  }], [])

  const actions = useMemo(() => 
    locales.map(({name, locale}) => ({
      type: locale, onClick: () => window.open(fullPath(locale), "_blank", "noopener,noreferrer"), label: `${name}`
    })
  ), [name, path])

  return (
    <>
      {import.meta.env.DEV && 
        <div className="ovirt-webadmin-hrefs-group v-start w-full">
          <span
            className="ovirt-webadmin-hrefs-title v-start"
          >
            {_pageName}
          </span>
          <ActionButtons actions={actions} />
        </div>
      }
    </>
  );
}

export default OVirtWebAdminHyperlink;
