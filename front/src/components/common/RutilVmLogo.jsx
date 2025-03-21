import { LogoIcon } from "../icons/RutilVmIcons"
import "./RutilVmLogo.css"

/**
 * @name RutilVmLogo
 * @description RutilVmLogo
 *
 * @returns {JSX.Element} RutilVmLogo
 */
const RutilVmLogo = ({description = "", details = "", ...props}) => (
  <figure className={`rutil-vm-logo ${props.className}`}>
    <LogoIcon textColor="#4679BC" />
    {description && <p>{description}</p>}
    {details && <figcaption>{details}</figcaption>}
  </figure>
);

export default RutilVmLogo;
