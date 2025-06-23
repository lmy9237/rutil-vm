import "./Spinner.css"

const Spinner = ({
  ...props
}) => (
  <div className={`spinner ${props.className && props.className}`}/>
)

export default Spinner;
