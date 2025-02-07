import SuperAreaChart from '../../components/Chart/SuperAreaChart'
import './DashboardDetailStat.css'

const DashboardDetailStat = ({title, totalPercentage}) => {
  return (
    <div className="dash-section-contents">
      <h1>{title}</h1>
      <div className="graphs">
        <div className="graph-wrap active-on-visible" 
          data-active-on-visible-callback-func-name="CircleRun"
        >
          <CpuApexChart cpu={totalPercentage ?? 0} /> {/* ApexChart 컴포넌트를 여기에 삽입 */}
        </div>
        <div>
          <CpuBarChart /> {/* BarChart 컴포넌트를 여기에 삽입 */}
        </div>
      </div>
      <span>USED 64 Core / Total 192 Core</span>
      <div className="wave-graph">
        <h2>Per CPU</h2>
        <div>
          <SuperAreaChart /> {/* AreaChart 컴포넌트를 여기에 삽입 */}
        </div>
      </div>
    </div>
  )
}

export default DashboardDetailStat 