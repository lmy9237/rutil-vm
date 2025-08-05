import "./Spinner.css"

const Spinner = ({
  mini=false,
  ...props
}) => (
  <div className={`spinner ${mini && "mini"} ${props.className && props.className}`}/>
)

export default Spinner;
