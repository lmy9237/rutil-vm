// import { useNavigate } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowUp, faArrowDown, faBatteryEmpty, faStarOfLife, faLink, faWarning, faEraser, faMessage } from '@fortawesome/free-solid-svg-icons'
// import './DashboardBoxGroup.css'

// const DashboardBox = ({ 
//   icon,
//   title, 
//   cntTotal, 
//   cntUp, 
//   cntDown, 
//   alert, 
//   error, 
//   warning, 
//   navigatePath 
// }) => {
//   const navigate = useNavigate();
  
//   return (
//     <div className="box" onClick={() => navigatePath && navigate(navigatePath)}>
//        <span className='box_icon_title'>
//         {icon && <FontAwesomeIcon icon={icon} fixedWidth />}
//         <p>{title}</p>
//       </span>
//       <h1>{cntTotal}</h1>
//       <div className="arrows">
//         {cntUp && <><FontAwesomeIcon icon={faArrowUp} fixedWidth/> {cntUp}&nbsp;</>}
//         {cntDown && <><FontAwesomeIcon icon={faArrowDown} fixedWidth/> {cntDown}</>}
//         {alert && <><FontAwesomeIcon icon={faMessage} fixedWidth/> {alert}&nbsp;</>}
//         {error && <><FontAwesomeIcon icon={faEraser} fixedWidth/> {error}&nbsp;</>}
//         {warning && <><FontAwesomeIcon icon={faWarning} fixedWidth/> {warning}</>}
//       </div>
//     </div>
//   )
// }

// const DashboardBoxGroup = ({ boxItems }) => {
//   return (
//     <div className="dash_boxs">
//       {boxItems && boxItems.map((e, i) => (
//         <DashboardBox  
//           key={i}
//           icon={e.icon}
//           title={e.title}
//           cntTotal={e.cntTotal}
//           cntUp={e.cntUp}
//           cntDown={e.cntDown}
//           alert={e.alert}
//           error={e.error}
//           warning={e.warning}
//           navigatePath={e.navigatePath} />
//       ))}
//     </div>
//   )
// }

// export default DashboardBoxGroup