import favIcon from "@/assets/images/favicon.ico";
import "./Background.css"

/**
 * @name Background
 * @description 배경이미지
 *
 * @returns {JSX.Element} Background
 */
const Background = ({ 
  children
}) => (
  <section className="w-full h-full"
    style={{
      content: "",
      position: "absolute",left: 0,top:0,
      backgroundImage: `url(${favIcon})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "50% 0",
      backgroundSize: "cover",
    }}
  >
    {children}
    <div className="color-overlay"></div>
  </section>
);

export default Background;
