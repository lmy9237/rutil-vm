import CONSTANT from "@/Constants";
import { LogoIcon } from "@/components/icons/RutilVmIcons"
import "./RutilVmLogo.css"

/**
 * @name RutilVmLogo
 * @description RutilVmLogo
 *
 * @returns {JSX.Element} RutilVmLogo
 */
const RutilVmLogo = ({
  description="",
  details="", 
  ...props
}) => (
  <figure
    className={`rutil-vm-logo f-center ${props.className}`}
  >
    <LogoIcon textColor={CONSTANT.color.logText} />
    {description && <p className="f-end fs-14">{description}</p>}
    {details && <figcaption className="f-end fs-10">{details}</figcaption>}
  </figure>
);

export default RutilVmLogo;
