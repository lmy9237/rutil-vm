import favIcon from "../../assets/images/favicon.ico";
import "./Background.css"

let sectionStyle = {
  content: " ",
  position: "absolute",left: 0,top:0,
  width:"100%",height: "100%",
  backgroundImage: `url(${favIcon})`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "50% 0",
  backgroundSize: "cover",
};

/**
 * @name Background
 * @description 배경이미지
 *
 * @returns {JSX.Element} Background
 */
const Background = ({ children }) => {
  return (
    <section style={sectionStyle}>
      {children}
      <div className="color-overlay"></div>
    </section>
  );
};

export default Background;
