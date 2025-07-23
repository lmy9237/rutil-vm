import React from "react";
import { useNavigate } from "react-router-dom";
import useUIState             from "@/hooks/useUIState";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Path = ({
  type,
  pathElements = [],
  basePath = "/",
}) => {
  const navigate = useNavigate();
  const {
    activeModal, setActiveModal,
    tabInPage, setTabInPage,
  } = useUIState()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathElements.map((element, index) => {
          const isLast = index === pathElements.length - 1;

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{element}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    onClick={() => {
                      if (index === 0) {
                        const basePathElements = basePath.split("/")
                        setTabInPage(basePathElements.slice(0, basePathElements.length-1).join("/"), "");
                        navigate(basePath)
                      }
                    }}
                    className={index === 0 ? "cursor-pointer hover:underline " : ""}
                  >
                    {element}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Path;

// import React, { useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   RVI16,
//   RVI12,
//   rvi12ArrowRight,
//   rvi16Cluster,
//   rvi16DataCenter,
//   rvi16Event
// } from "@/components/icons/RutilVmIcons";
// import "./Path.css"; // CSS 파일 분리

// /**
//  * @name Path
//  * @description Path
//  *
//  * @returns {JSX.Element} Path
//  */
// const Path = ({ 
//   type,
//   pathElements,
//   basePath
// }) => {
//   const navigate = useNavigate();
//   const iconDef = useMemo(() => {
//     switch(type) {
//       case "datacenter": return rvi16DataCenter("currentColor")
//       case "cluster": return rvi16Cluster("currentColor")
//       case "event": return rvi16Event("currentColor")
//       default: return null;
//     }
//   }, [type])

//   return (
//     <div className="path f-start gap-1 fs-14">
//       {[...pathElements].map((element, index) => (
//         <React.Fragment key={index}>
//           {/* {(index === 0 && type) ? <RVI16 iconDef={iconDef} /> : null} */}
//           <span
//             className={`path-element ${index === 0 ? "clickable" : ""} ${
//               index === pathElements.length - 1 ? "last-path-element" : ""
//             }`}
//             onClick={() => index === 0 && navigate(basePath)}
//           >
//             {element}
//           </span>
//           {index !== pathElements.length-1 && (
//             <RVI12 iconDef={rvi12ArrowRight} />
//           )}
//         </React.Fragment>
//       ))}
//     </div>
//   );
// };

// export default Path;
