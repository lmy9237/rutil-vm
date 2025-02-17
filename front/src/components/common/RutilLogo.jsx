import RutilVmLogoImg from "../../assets/images/rutil_logo.png"

const logoStyleDefault = {
  width:"auto",height:"10vh",background:"transparent"
}

/**
 * @name RutilVmLogo
 * @description RutilVmLogo
 *
 * @returns {JSX.Element} RutilVmLogo
 */
const RutilVmLogo = () => {
  return (
    <p className="w-auto h-auto text-xl text-center flex justify-center items-center">
      <img className="rutil-logo" src={RutilVmLogoImg} alt="RutilVM" style={logoStyleDefault} />
      로그인
    </p>
  );
};

export default RutilVmLogo;
