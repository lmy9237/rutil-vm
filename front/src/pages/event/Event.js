import { faListUl } from '@fortawesome/free-solid-svg-icons';
import HeaderButton from '../../components/button/HeaderButton';
import Footer from '../../components/footer/Footer';
import { useAllEvents } from '../../api/RQHook';
import EventTable from './EventTable';

// Modal.setAppElement('#root');

const Event = () => {
  const { 
    data: events, 
  } = useAllEvents((e) => ({...e,}));
  

  return (
    <div id="section">
      <HeaderButton
        titleIcon={faListUl}
        title="Event"
        subtitle="Chart"
        buttons={[]}
        popupItems={[]}
        openModal={[]}
        togglePopup={() => {}}
      />
      <div className="content-outer">
        <div className="empty-nav-outer">
          <EventTable 
            events={events}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Event;
