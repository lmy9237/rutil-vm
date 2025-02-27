import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import STOMP from './Socket';

import Header from './components/Header/Header';
import MainOuter from './components/mainouter/MainOuter';

import Dashboard from './pages/dashboard/Dashboard';
import RutilManager from './pages/Rutil/RutilManager';
import DataCenterInfo from './pages/computing/datacenter/DataCenterInfo';
import ClusterInfo from './pages/computing/cluster/ClusterInfo';
import HostInfo from './pages/computing/host/HostInfo';
import AllVm from './pages/computing/vm/AllVm';
import VmInfo from './pages/computing/vm/VmInfo';
import AllTemplates from './pages/computing/template/AllTemplates';
import TemplateInfo from './pages/computing/template/TemplateInfo';
import AllNetwork from './pages/network/network/AllNetwork';
import NetworkInfo from './pages/network/network/NetworkInfo';
import AllVnic from './pages/network/vnicProfile/AllVnic';
import VnicProfileInfo from './pages/network/vnicProfile/VnicProfileInfo';
import AllDomain from './pages/storage/domain/AllDomain';
import DomainInfo from './pages/storage/domain/DomainInfo';
import AllDisk from './pages/storage/disk/AllDisk';
import DiskInfo from './pages/storage/disk/DiskInfo';
import Event from './pages/event/Event';
import SettingInfo from './pages/setting/SettingInfo';
import Login from './pages/login/Login';
import Error from './pages/Error';
import './App.css';
import Footer from './components/footer/Footer';


const App = () => {
  //#region: 웹소켓연결
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  useEffect(() => {
    // Connect using STOMP
    STOMP.connect({}, (frame) => {
      console.log('Connected: ' + frame);
      
      // Subscribe to a topic
      STOMP.subscribe('/topic/public', (res) => {
        const receivedMessage = JSON.parse(res.body);
        console.log(`message received! ... ${receivedMessage}`)
        showMessage(receivedMessage);
        showToast(receivedMessage);  // Show toast on message receive
      });
    });

    // Set stomp client in state
    setStompClient(STOMP);

    // Cleanup on component unmount
    return () => {
      if (STOMP) {
        STOMP.disconnect(() => {
          console.log('Disconnected from STOMP');
        });
      }
    };
  }, []);
  //#endregion: 웹소켓연결

  const showMessage = (message) => {
    console.log(`App > showMessage ...`)
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const showToast = (msg) => {
    console.log(`App > showToast ...`);
    toast(`${msg.content}`, {
      icon: `${msg.symbol}`,
      duration: 1500,
      ariaProps: {
        role: 'status',
        'aria-live': 'polite',
      },
    });
  };

  const queryClient = new QueryClient()
  const isAuthenticated = () => {
    console.log(`App > isAuthenticated ...`);
    return localStorage.getItem('username') !== null; // Example: check if a token exists
  };
  
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);


  const [asideVisible, setAsideVisible] = useState(true); // aside-outer 상태 관리
  const toggleAside = () => {
    console.log(`App > toggleAside ...`);
    setAsideVisible((prev) => !prev); // 열림/닫힘 상태만 변경
  };
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {authenticated ? (
          <>
            <Header setAuthenticated={setAuthenticated} toggleAside={toggleAside}/>
            <MainOuter asideVisible={asideVisible} setAsideVisible={setAsideVisible}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/computing/rutil-manager" element={<RutilManager />} />
                <Route path="/computing/rutil-manager/:section" element={<RutilManager />} />

                <Route path="/computing/datacenters/:id/:section" element={<DataCenterInfo />} />

                <Route path="/computing/clusters/:id" element={<ClusterInfo />} />
                <Route path="/computing/clusters/:id/:section" element={<ClusterInfo />} />  
                
                <Route path="/computing/hosts/:id" element={<HostInfo />}/>
                <Route path="/computing/hosts/:id/:section" element={<HostInfo />}/>

                <Route path="/computing/vms" element={<AllVm />} />
                <Route path="/computing/vms/:id" element={<VmInfo />} />
                <Route path="/computing/vms/:id/:section" element={<VmInfo />} />
                
                <Route path="/computing/vms/templates" element={<AllTemplates />} />
                <Route path="/computing/templates" element={<AllTemplates />} />
                <Route path="/computing/templates/:id" element={<TemplateInfo />} />
                <Route path="/computing/templates/:id/:section" element={<TemplateInfo />} />
                              
                <Route path="/networks/rutil-manager" element={<RutilManager />} />
                <Route path="/networks/rutil-manager/:section" element={<RutilManager />} />

                <Route path="/networks" element={<AllNetwork />} />
                <Route path="/networks/datacenters/:id/:section" element={<DataCenterInfo />} />
                <Route path="/networks/:id" element={<NetworkInfo />} /> 
                <Route path="/networks/:id/:section" element={<NetworkInfo />} /> 

                <Route path="/vnicProfiles" element={<AllVnic />} />
                <Route path="/vnicProfiles/:id/:section" element={<VnicProfileInfo />} />

                <Route path="/storages/rutil-manager" element={<RutilManager />} />
                <Route path="/storages/rutil-manager/:section" element={<RutilManager />} />

                <Route path="/storages/domains" element={<AllDomain />} />
                <Route path="/storages/datacenters/:id/:section" element={<DataCenterInfo />} />
                <Route path="/storages/domains/:id" element={<DomainInfo />} /> 
                <Route path="/storages/domains/:id/:section" element={<DomainInfo />} /> 
          
                <Route path="/storages/disks" element={<AllDisk />} />
                <Route path="/storages/disks/:id" element={<DiskInfo />} />
                <Route path="/storages/disks/:id/:section" element={<DiskInfo />} />

                <Route path="/events" element={<Event />} />
                <Route path="/settings/:section" element={<SettingInfo />} />
                <Route path="/error" element={<Error />} />
              </Routes>
            </MainOuter>
            <Footer />
          </>
          ) :
          (<Routes>
            <Route path="/" element={<Login setAuthenticated={setAuthenticated} />} />
          </Routes>)
        }
      </Router>
      <Toaster 
        position="top-center"
        reverseOrder={false}    
        gutter={4} 
        toastOptions={{
          style: {
            fontSize: '10px', // 글씨 크기를 작게 설정
            background: '#333', // 배경색 (선택)
            color: '#fff', // 글자색 (선택)
          },
          success: {
            style: {
              fontSize: '10px', // 성공 알림의 글씨 크기
              background: 'green',
              color: '#fff',
            },
          },
          error: {
            style: {
              fontSize: '12px', // 오류 알림의 글씨 크기
              background: 'red',
              color: '#fff',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}


export default App;
