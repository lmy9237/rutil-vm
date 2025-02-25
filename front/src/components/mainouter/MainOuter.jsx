import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { adjustFontSize } from '../../UIEvent';
import { useAllTreeNavigations, } from '../../api/RQHook';
import './MainOuter.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faThLarge, faDesktop, faServer, faDatabase, faCog, faBuilding, faUser, faMicrochip, faChevronLeft, faChevronRight,faChevronDown,
    faListUl,
    faFileEdit,
    faEarthAmericas,
    faLayerGroup,
    faCloud,
    faSquare
} from '@fortawesome/free-solid-svg-icons'

/**
 * @name MainOuter
 * @description ...
 *
 * @prop {string[]} columns
 * @returns {JSX.Element} MainOuter
 * 
 */
const MainOuter = ({ children,asideVisible,setAsideVisible   }) => {
    const [sidebarWidth, setSidebarWidth] = useState(240); // 초기 사이드바 너비 (%)
    const asideStyles = {
        width: asideVisible ? `${sidebarWidth}px` : "0px", // 닫힐 때 0px
        minWidth: asideVisible ? "240px" : "0px", // 최소 크기 설정
    };
    const resizerRef = useRef(null);
    const isResizing = useRef(false);
    const xRef = useRef(0);
    const leftWidthRef = useRef(0);

    /* aside-popup화면사이즈드레그 */
    useEffect(() => {
        // 마우스 이벤트 해제 (Unmount 시)
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    const handleMouseDown = (e) => {
        isResizing.current = true;
        xRef.current = e.clientX;
        leftWidthRef.current = sidebarWidth;
    
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    
        document.body.style.userSelect = "none"; // ✅ 드래그 중 텍스트 선택 방lo지
        document.body.style.cursor = "col-resize"; // ✅ 드래그 중 커서 고정
    };
    
    const handleMouseMove = (e) => {
        if (!isResizing.current) return;
    
        requestAnimationFrame(() => {
                const dx = e.clientX - xRef.current; // 이동한 거리 (픽셀)
                const newWidth = leftWidthRef.current + dx; // 기존 너비에 이동 거리 더하기

                if (newWidth > 240 && newWidth < 400) { // 사이드바 최소/최대 너비 설정
                    setSidebarWidth(newWidth);
            }
        });
    };
    
    const handleMouseUp = () => {
        isResizing.current = false;
        
        document.body.style.userSelect = "auto"; // ✅ 드래그 끝나면 다시 원래대로
        document.body.style.cursor = "default"; // ✅ 드래그 끝나면 기본 커서로 복구
    };
    
    /* */
    const [isResponsive, setIsResponsive] = useState(window.innerWidth <= 1420);

    useEffect(() => { 
        const handleResize = () => {
            const isNowResponsive = window.innerWidth <= 1420;
            setIsResponsive(isNowResponsive);
    
            if (isNowResponsive) {
                setAsideVisible(false); // ✅ 1420px 이하일 때 aside 자동 닫기
            }
        };
    
        window.addEventListener('resize', handleResize);
        handleResize(); // 초기 렌더링 시 체크
    
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const [lastSelected, setLastSelected] = useState(null); // 마지막 선택 항목 저장
    const [selectedDisk, setSelectedDisk] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const [asidePopupVisible, setAsidePopupVisible] = useState(true);
    const [asidePopupBackgroundColor, setAsidePopupBackgroundColor] = useState({
        dashboard: '',
        computing: '',
        storage: '',
        network: '',
        settings: '',
        event: '',
        default: 'rgb(218, 236, 245)'
    });
    const [selected, setSelected] = useState(() => localStorage.getItem('selected') || 'dashboard');    
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [contextMenuTarget, setContextMenuTarget] = useState(null);
    const [activeSection, setActiveSection] = useState('general');
    const [isInitialLoad, setIsInitialLoad] = useState(true); // 초기 대시보드섹션 설정

    // url에 따라 맞는버튼 색칠
    const [selectedDiv, setSelectedDiv] = useState(null);
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/computing')) {
            handleClick('computing');  // /computing이 들어가 있을 때
        } else if (path.includes('/networks')) {
            handleClick('network');    // /networks가 들어가 있을 때
        } else if (path.includes('/vnicProfiles')) {
            handleClick('network');    // /networks가 들어가 있을 때
        } else if (path.includes('/storages')) {
            handleClick('storage');    // /storages가 들어가 있을 때
        } else if (path.includes('/events')) {
            handleClick('event');      // /events가 들어가 있을 때
        } else if (path.includes('/settings')) {
            handleClick('settings');    // /settings가 들어가 있을 때
        } else {
            handleClick('dashboard');  // 기본적으로 dashboard로 설정
        }
    }, [location.pathname]);

    const getClassNames = (id) => {
       return selected === id ? 'selected blue-text' : ''
    };

    useEffect(() => {
        const path = location.pathname;
        const pathParts = path.split('/'); 
        const lastId = pathParts[pathParts.length - 1]; // 마지막 부분이 ID

        setSelectedDiv(lastId);
    }, [location.pathname]);

    // 클러스터(컴퓨팅)api
    const { 
        data: navClusters,          
        refetch: navClustersRefetch,  
    } = useAllTreeNavigations('cluster');
  
    // 네트워크 api
    const { 
        data: navNetworks,
        refetch: navNetworksRefetch, 
    } = useAllTreeNavigations('network');
  
    // 스토리지 도메인 api
    const { 
        data: navStorageDomains,         
        refetch: navStorageDomainsRefetch, 
    } = useAllTreeNavigations('storagedomain');


    useEffect(() => {
        const fetchData = async () => {
            try {
                await navClustersRefetch(); 
                console.log("Clusters:", navClusters);
            } catch (error) {
                console.error('Error fetching clusters:', error);
            }
        };
        fetchData();
    }, [navClustersRefetch]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                await navNetworksRefetch();
                console.log("Networks:", navNetworks);
            } catch (error) {
                console.error('Error fetching networks:', error);
            }
        };
        fetchData();
    }, [navNetworksRefetch]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                await navStorageDomainsRefetch();
                console.log("Storage Domains:", navStorageDomains);
            } catch (error) {
                console.error('Error fetching storage domains:', error);
            }
        };
        fetchData();
    }, [navStorageDomainsRefetch]);
 
    useEffect(() => {
        const waveGraph = document.querySelector('.wave_graph');
        if (waveGraph) {
            if (selected === 'dashboard' && asidePopupVisible) {
                waveGraph.style.marginLeft = '0'; // Dashboard일 때 aside-popup 열려있으면 margin-left를 0으로
            } else {
                waveGraph.style.marginLeft = '1rem'; // 기본값
            }
        }
    }, [selected, asidePopupVisible]); // selected와 asidePopupVisible이 변경될 때 실행
    // 새로고침해도 섹션유지-----------------------------
    const [isSecondVisible, setIsSecondVisible] = useState(
        JSON.parse(localStorage.getItem('isSecondVisible')) || false
    );
    const [openDataCenters, setOpenDataCenters] = useState(() => 
        JSON.parse(localStorage.getItem('openDataCenters')) || {}
    );
    const [openClusters, setOpenClusters] = useState(() => 
        JSON.parse(localStorage.getItem('openClusters')) || {}
    );
    const [openHosts, setOpenHosts] = useState(() => 
        JSON.parse(localStorage.getItem('openHosts')) || {}
    );
    const [openDomains, setOpenDomains] = useState(() => 
        JSON.parse(localStorage.getItem('openDomains')) || {}
    );
    const [openNetworks, setOpenNetworks] = useState(() => 
        JSON.parse(localStorage.getItem('openNetworks')) || {}
    );
    const [openComputingDataCenters, setOpenComputingDataCenters] = useState(() =>
        JSON.parse(localStorage.getItem('openComputingDataCenters')) || {}
    );
    const [openNetworkDataCenters, setOpenNetworkDataCenters] = useState(() =>
        JSON.parse(localStorage.getItem('openNetworkDataCenters')) || {}
    );

    // 상태가 변경될 때마다 localStorage에 저장
    useEffect(() => {
        localStorage.setItem('isSecondVisible', JSON.stringify(isSecondVisible));
    }, [isSecondVisible]);

    useEffect(() => {
        localStorage.setItem('openDataCenters', JSON.stringify(openDataCenters));
    }, [openDataCenters]);

    useEffect(() => {
        localStorage.setItem('openClusters', JSON.stringify(openClusters));
    }, [openClusters]);

    useEffect(() => {
        localStorage.setItem('openHosts', JSON.stringify(openHosts));
    }, [openHosts]);

    useEffect(() => {
        localStorage.setItem('openDomains', JSON.stringify(openDomains));
    }, [openDomains]);

    useEffect(() => {
        localStorage.setItem('openNetworks', JSON.stringify(openNetworks));
    }, [openNetworks]);
    useEffect(() => {
        localStorage.setItem('openComputingDataCenters', JSON.stringify(openComputingDataCenters));
    }, [openComputingDataCenters]);

    useEffect(() => {
        localStorage.setItem('openNetworkDataCenters', JSON.stringify(openNetworkDataCenters));
    }, [openNetworkDataCenters]);

    const toggleComputingDataCenter = (dataCenterId) => {
        setOpenComputingDataCenters((prevState) => ({
            ...prevState,
            [dataCenterId]: !prevState[dataCenterId],
        }));
    };

    const toggleNetworkDataCenter = (dataCenterId) => {
        setOpenNetworkDataCenters((prevState) => ({
            ...prevState,
            [dataCenterId]: !prevState[dataCenterId],
        }));
    };


    // 열림/닫힘 상태 변경 함수
    const toggleDataCenter = (dataCenterId) => {
        setOpenDataCenters(prevState => ({
            ...prevState,
            [dataCenterId]: !prevState[dataCenterId]
        }));
    };
    
    const toggleCluster = (clusterId) => {
        setOpenClusters(prevState => ({
            ...prevState,
            [clusterId]: !prevState[clusterId]
        }));
    };
  
    const toggleHost = (hostId) => {
        setOpenHosts(prevState => ({
            ...prevState,
            [hostId]: !prevState[hostId]
        }));
    };

    useEffect(() => {
        window.addEventListener('resize', adjustFontSize);
            adjustFontSize();
        return () => { window.removeEventListener('resize', adjustFontSize); };
    }, []);

    const handleDetailClickStorage = (diskName) => {
        if (selectedDisk !== diskName) {
            setSelectedDisk(diskName);
            setSelectedDiv(null);
            navigate(`/storages/disks/${diskName}`);
        }
    };
    // 대시보드 경로일 때 aside-popup 열지 않도록 처리
    const handleAsidePopupBtnClick = () => {
        setAsidePopupVisible((prev) => !prev); 

    };

    const handleClick = (id) => {
        if (id !== selected) {
            setSelected(id); // 선택한 섹션만 업데이트
            toggleAsidePopup(id); // 배경색 설정
            setAsidePopupVisible(true); // 항상 열림 상태 유지
            localStorage.setItem('selected', id); // 로컬 스토리지 저장
        }
        // 이벤트와 설정을 제외한 경우에만 마지막 선택 항목을 저장
        if (id !== 'event' && id !== 'settings' && id !== 'dashboard') {
            setLastSelected(id);
            localStorage.setItem('lastSelected', id);  // 로컬 스토리지에 저장
        }
    };
      
    const renderAsidePopupContent = () => {
        if (isInitialLoad && selected === 'dashboard') {
            return renderAsidePopup('computing');
        }
        // 이벤트와 설정에서는 이전에 선택한 섹션의 콘텐츠를 표시
        if (selected === 'event' || selected === 'settings' ||  selected === 'dashboard') {
            return lastSelected ? renderAsidePopup(lastSelected) : <div>선택된 내용이 없습니다.</div>;
        }
        return renderAsidePopup(selected); // 현재 선택된 항목의 콘텐츠를 표시
    };

    // 초기에는 가상머신 섹션을 마지막 섹션으로 설정
    useEffect(() => {
        if (isInitialLoad && selected === 'dashboard') {
            setLastSelected('computing'); 
        }
        setIsInitialLoad(false); 
    }, [isInitialLoad, selected]);

    const renderAsidePopup = (selected) => {
        return (
        <>
            {/*가상머신 섹션*/} 
            {selected === 'computing' && (
                <div id="virtual_machine_chart">
                    {/* 첫 번째 레벨 (Rutil Manager) */}
                    <div
                        className="aside-popup-content"
                        id="aside_popup_first"
                        style={{ backgroundColor: getBackgroundColor('rutil-manager') }}
                        onClick={() => {
                            if (selectedDiv !== 'rutil-manager') {
                                setSelectedDiv('rutil-manager');
                                navigate('/computing/rutil-manager');
                            }
                        }}
                    >
                        <FontAwesomeIcon
                            style={{ fontSize: '0.3rem', marginRight: '0.04rem' }}
                            icon={isSecondVisible ? faChevronDown : faChevronRight}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsSecondVisible(!isSecondVisible); // Only toggles on icon click
                        }}
                        fixedWidth
                        />
                        <FontAwesomeIcon icon={faBuilding} fixedWidth />
                        <span>Rutil manager</span>
                    </div>

                    {/* 두 번째 레벨 (Data Center) */}
                    {isSecondVisible && navClusters && navClusters.map((dataCenter) => {
                        const isDataCenterOpen = openComputingDataCenters[dataCenter.id] || false;
                        const hasClusters = Array.isArray(dataCenter.clusters) && dataCenter.clusters.length > 0;
                        return (
                            <div key={dataCenter.id}>
                                <div
                                    className="aside-popup-second-content"
                                    style={{
                                        backgroundColor: getBackgroundColor(dataCenter.id),
                                        paddingLeft: hasClusters ? '0.4rem' : '0.8rem'
                                    }}
                                    onClick={() => {
                                        setSelectedDiv(dataCenter.id);
                                        navigate(`/computing/datacenters/${dataCenter.id}/clusters`);
                                    }}
                                >
                                    {hasClusters && (
                                        <FontAwesomeIcon
                                            style={{ fontSize: '0.3rem', marginRight: '0.04rem' }}
                                            icon={isDataCenterOpen ? faChevronDown : faChevronRight}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleComputingDataCenter(dataCenter.id);
                                            }}
                                            fixedWidth
                                        />
                                    )}
                                    <FontAwesomeIcon icon={faLayerGroup} fixedWidth />
                                    <span>{dataCenter.name}</span>
                                </div>

                                {/* 세 번째 레벨 (Clusters) */}
                                {isDataCenterOpen && Array.isArray(dataCenter.clusters) && dataCenter.clusters.map((cluster) => {
                                    const isClusterOpen = openClusters[cluster.id] || false;
                                    const hasHosts = Array.isArray(cluster.hosts) && cluster.hosts.length > 0;
                                    return (
                                        <div key={cluster.id}>
                                            <div
                                                className="aside-popup-third-content"
                                                style={{
                                                    backgroundColor: getBackgroundColor(cluster.id),
                                                    paddingLeft: hasHosts ? '0.6rem' : '1rem'
                                                }}
                                                onClick={() => {
                                                    setSelectedDiv(cluster.id);
                                                    navigate(`/computing/clusters/${cluster.id}`);
                                                }}
                                            >
                                                {hasHosts && (
                                                    <FontAwesomeIcon
                                                        style={{ fontSize: '0.3rem', marginRight: '0.04rem' }}
                                                        icon={isClusterOpen ? faChevronDown : faChevronRight}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleCluster(cluster.id); // Only toggles on icon click
                                                        }}
                                                        fixedWidth
                                                    />
                                                )}
                                                <FontAwesomeIcon icon={faEarthAmericas} fixedWidth />
                                                <span>{cluster.name}</span>
                                            </div>

                                            {/* 네 번째 레벨 (Hosts) */}
                                            {isClusterOpen && Array.isArray(cluster.hosts) && cluster.hosts.map((host) => {
                                                const isHostOpen = openHosts[host.id] || false;
                                                const hasVMs = Array.isArray(host.vms) && host.vms.length > 0;
                                                return (
                                                    <div key={host.id}>
                                                        <div
                                                            className="aside-popup-fourth-content"
                                                            style={{
                                                                backgroundColor: getBackgroundColor(host.id),
                                                                paddingLeft: hasVMs ? '0.8rem' : '1.2rem'
                                                            }}
                                                            onClick={() => {
                                                                setSelectedDiv(host.id);
                                                                navigate(`/computing/hosts/${host.id}`);
                                                            }}
                                                        >
                                                            {hasVMs && (
                                                                <FontAwesomeIcon
                                                                    style={{ fontSize: '0.3rem', marginRight: '0.04rem'}}
                                                                    icon={isHostOpen ? faChevronDown : faChevronRight}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleHost(host.id); // Only toggles on icon click
                                                                    }}
                                                                    fixedWidth
                                                                />
                                                            )}
                                                            <FontAwesomeIcon icon={faUser} fixedWidth />
                                                            <span>{host.name}</span>
                                                        </div>

                                                        {/* 다섯 번째 레벨 (VMs) */}
                                                        {isHostOpen && Array.isArray(host.vms) && host.vms.map((vm) => (
                                                            <div
                                                                key={vm.id}
                                                                className="aside_popup_last_content"
                                                                style={{
                                                                    backgroundColor: getBackgroundColor(vm.id),
                                                                    paddingLeft: '1.5rem'
                                                                }}
                                                                onClick={() => {
                                                                    setSelectedDiv(vm.id);
                                                                    navigate(`/computing/vms/${vm.id}`);
                                                                }}
                                                            >
                                                                <FontAwesomeIcon icon={faMicrochip} fixedWidth />
                                                                <span>{vm.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            })}
                                            
                                            {/* vmDowns 정보 추가 */}
                                            {isClusterOpen && Array.isArray(cluster.vmDowns) && cluster.vmDowns.map((vmDown) => (
                                                <div
                                                    key={vmDown.id}
                                                    className="aside-popup-fourth-content" 
                                                    style={{
                                                        backgroundColor: getBackgroundColor(vmDown.id),
                                                        paddingLeft: '1.2rem'
                                                    }}
                                                    onClick={() => {
                                                        setSelectedDiv(vmDown.id);
                                                        navigate(`/computing/vms/${vmDown.id}`);
                                                    }}
                                                >
                                                    <div style={{ position: 'relative', display: 'inline-block' }}>
                                                        <FontAwesomeIcon icon={faMicrochip} fixedWidth />
                                                        <FontAwesomeIcon 
                                                            icon={faSquare} 
                                                            fixedWidth 
                                                            style={{ 
                                                                position: 'absolute', 
                                                                bottom: '4', 
                                                                right: '0', 
                                                                fontSize: '0.5em', 
                                                                color: 'rgb(200 0 0)' 
                                                            }} 
                                                        />
                                                    </div>
                                                    <span>{vmDown.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 네트워크 섹션 */}
            {selected === 'network' && (
                <div id="network_chart">
                    {/* 첫 번째 레벨 (Rutil Manager) */}
                    <div
                        className="aside-popup-content"
                        id="aside_popup_first"
                        style={{ backgroundColor: getBackgroundColor('rutil-manager') }}
                        onClick={() => {
                            setSelectedDiv('rutil-manager');
                            navigate('/networks/rutil-manager');
                        }}
                    >
                        <FontAwesomeIcon
                            style={{ fontSize: '0.3rem', marginRight: '0.04rem' }}
                            icon={openDataCenters.network ? faChevronDown : faChevronRight}
                            onClick={(e) => {
                                e.stopPropagation();
                                setOpenDataCenters((prev) => ({ ...prev, network: !prev.network })); // Toggle only on icon click
                            }}
                            fixedWidth
                        />
                        <FontAwesomeIcon icon={faBuilding} fixedWidth />
                        <span>Rutil manager</span>
                    </div>

                    {/* 두 번째 레벨 (Data Center) */}
                    {navNetworks && navNetworks.map((dataCenter) => {
                        const isDataCenterOpen = openNetworkDataCenters[dataCenter.id] || false;
                        const hasNetworks = Array.isArray(dataCenter.networks) && dataCenter.networks.length > 0;

                        return (
                            <div key={dataCenter.id}>
                                <div
                                    className="aside-popup-second-content"
                                    style={{
                                        backgroundColor: getBackgroundColor(dataCenter.id),
                                        paddingLeft: hasNetworks ? '0.4rem' : '0.8rem',
                                    }}
                                    onClick={() => {
                                        setSelectedDiv(dataCenter.id);
                                        navigate(`/networks/datacenters/${dataCenter.id}/clusters`);
                                    }}
                                >
                                    {hasNetworks && (
                                        <FontAwesomeIcon
                                            style={{ fontSize: '0.3rem', marginRight: '0.04rem' }}
                                            icon={isDataCenterOpen ? faChevronDown : faChevronRight}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleNetworkDataCenter(dataCenter.id);
                                            }}
                                            fixedWidth
                                        />
                                    )}
                                    <FontAwesomeIcon icon={faLayerGroup} fixedWidth />
                                    <span>{dataCenter.name}</span>
                                </div>

                                {/* 세 번째 레벨 */}
                                {isDataCenterOpen &&
                                    dataCenter.networks.map((network) => (
                                        <div
                                            key={network.id}
                                            className="aside-popup-third-content"
                                            style={{
                                                backgroundColor: getBackgroundColor(network.id),
                                                paddingLeft: '1rem',
                                            }}
                                            onClick={() => {
                                                setSelectedDiv(network.id);
                                                navigate(`/networks/${network.id}`);
                                            }}
                                        >
                                            <FontAwesomeIcon
                                                icon={faFileEdit}
                                                style={{ fontSize: '0.34rem', marginRight: '0.05rem' }}
                                                fixedWidth
                                            />
                                            <span>{network.name}</span>
                                        </div>
                                    ))}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 스토리지 섹션 */} 
            {selected === 'storage' && (
            <div id="storage_chart">
                {/* 첫 번째 레벨 (Rutil Manager) */}
                <div
                    className="aside-popup-content"
                    id="aside_popup_first"
                    style={{ backgroundColor: getBackgroundColor('rutil-manager') }}
                    onClick={() => {
                        if (selectedDiv !== 'rutil-manager') {
                            setSelectedDiv('rutil-manager');
                            navigate('/storages/rutil-manager');
                        }
                    }}
                >
                    <FontAwesomeIcon
                        style={{ fontSize: '0.3rem', marginRight: '0.04rem' }}
                        icon={isSecondVisible ? faChevronDown : faChevronRight}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsSecondVisible(!isSecondVisible); // Toggle only on icon click
                        }}
                        fixedWidth
                    />
                    <FontAwesomeIcon icon={faBuilding} fixedWidth />
                    <span>Rutil manager</span>
                </div>

                {/* 두 번째 레벨 (Data Center) */}
                {isSecondVisible && navStorageDomains && navStorageDomains.map((dataCenter) => {
                    const isDataCenterOpen = openDataCenters[dataCenter.id] || false;
                    const hasDomains = Array.isArray(dataCenter.storageDomains) && dataCenter.storageDomains.length > 0;
                    return (
                        <div key={dataCenter.id}>
                            <div
                                className="aside-popup-second-content"
                                style={{
                                    backgroundColor: getBackgroundColor(dataCenter.id),
                                    paddingLeft: hasDomains ? '0.4rem' : '0.8rem'
                                }}
                                onClick={() => {
                                    setSelectedDiv(dataCenter.id);
                                    navigate(`/storages/datacenters/${dataCenter.id}/clusters`);
                                }}
                            >
                                {hasDomains && (
                                    <FontAwesomeIcon
                                        style={{ fontSize: '0.3rem', marginRight: '0.04rem' }}
                                        icon={isDataCenterOpen ? faChevronDown : faChevronRight}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleDataCenter(dataCenter.id);
                                        }}
                                        fixedWidth
                                    />
                                )}
                                <FontAwesomeIcon icon={faLayerGroup} fixedWidth />
                                <span>{dataCenter.name}</span>
                            </div>

                            {/* 세 번째 레벨 (Storage Domains) */}
                            {isDataCenterOpen && Array.isArray(dataCenter.storageDomains) && dataCenter.storageDomains.map((domain) => {
                                const isDomainOpen = openDomains[domain.id] || false;
                                const hasDisks = Array.isArray(domain.disks) && domain.disks.length > 0;
                                return (
                                    <div key={domain.id}>
                                        <div
                                            className="aside-popup-third-content"
                                            style={{
                                                backgroundColor: getBackgroundColor(domain.id),
                                                paddingLeft: hasDisks ? '0.6rem' : '1rem'
                                            }}
                                            onClick={() => {
                                                setSelectedDiv(domain.id);
                                                navigate(`/storages/domains/${domain.id}`);
                                            }}
                                            onContextMenu={(e) => {
                                                e.preventDefault(); // 기본 컨텍스트 메뉴 비활성화
                                                setContextMenuVisible(true);
                                                setContextMenuPosition({ x: e.pageX, y: e.pageY });
                                                setContextMenuTarget(domain.id); // 우클릭한 요소의 ID 저장
                                            }}
                                        >
                                            {hasDisks && (
                                                <FontAwesomeIcon
                                                    style={{ fontSize: '0.3rem', marginRight: '0.04rem' }}
                                                    icon={isDomainOpen ? faChevronDown : faChevronRight}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleDomain(domain.id);
                                                    }}
                                                    fixedWidth
                                                />
                                            )}
                                            <FontAwesomeIcon icon={faCloud} fixedWidth />
                                            <span>{domain.name}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
            )}
        </>
        );
    };
    

    useEffect(() => {
        // 페이지가 처음 로드될 때 기본적으로 dashboard가 선택되도록 설정
        setSelected('dashboard');
        setLastSelected('computing');
        toggleAsidePopup('dashboard');
    }, []);
    useEffect(() => {
        // 페이지가 처음 로드될 때 기본적으로 computing 섹션이 선택되도록 설정
        setSelected('computing');
        toggleAsidePopup('computing');
        setSelectedDiv(null); // 루틸매니저가 선택되지 않도록 초기화
    }, []);

    useEffect(() => {
        navNetworksRefetch();
    }, [navNetworksRefetch]); 

    const toggleDomain = (domainId) => {
        setOpenDomains((prevState) => ({
            ...prevState,
            [domainId]: !prevState[domainId], 
        }));
    };

    const toggleAsidePopup = (id) => {
        const newBackgroundColor = {
            dashboard: '',
            computing: '',
            storage: '',
            network: '',
            setting: '',
            event: '',
            default: ''
        };
        // selected 값에 따라 색상을 변경하는 로직
        if (id === 'dashboard') {
            newBackgroundColor.dashboard = 'rgb(218, 236, 245)';
        } else if (id === 'computing') {
            newBackgroundColor.computing = 'rgb(218, 236, 245)';
        } else if (id === 'storage') {
            newBackgroundColor.storage = 'rgb(218, 236, 245)';
        } else if (id === 'network') {
            newBackgroundColor.network = 'rgb(218, 236, 245)';
        } else if (id === 'event') {
            newBackgroundColor.event = 'rgb(218, 236, 245)';
        } else if (id === 'settings') {
            newBackgroundColor.settings = 'rgb(218, 236, 245)';
        } 
        setAsidePopupBackgroundColor(newBackgroundColor);
    };

    // 저장된 항목에 맞춰 배경색 초기화
    useEffect(() => {
        const savedSelected = localStorage.getItem('selected');
        const savedLastSelected = localStorage.getItem('lastSelected');
        if (savedSelected) {
            setSelected(savedSelected);
            toggleAsidePopup(savedSelected);
        } else {
            setSelected('dashboard');
            toggleAsidePopup('dashboard');
        }
        if (savedLastSelected) {
            setLastSelected(savedLastSelected);
        }
    }, []);
    // id포함유무에 따라 배경색결정
    const getBackgroundColor = (id) => {
        const path = location.pathname;
        return path.includes(id) ? 'rgb(218, 236, 245)' : '';
    };

    const handleMainClick = () => {
        setContextMenuVisible(false);
        setContextMenuTarget(null);
    };

    const asideClasses = `aside-outer ${asideVisible ? 'open' : 'closed'} ${window.innerWidth <= 1420 ? 'responsive-closed' : ''}`;

    return (
      <div className="main-outer" onClick={handleMainClick}>
            <div className={asideClasses} style={asideStyles}>
            <div id="aside">
                <div className="nav">
                    {/* 대시보드 버튼 */}
                    <Link to="/" className="link-no-underline">
                        <div
                            className={getClassNames("dashboard")}
                            onClick={() => {
                                handleClick("dashboard"); // 선택 상태 업데이트
                                setAsidePopupVisible(true); // 대시보드 클릭 시 열림
                            }}
                            style={{ backgroundColor: asidePopupBackgroundColor.dashboard }}
                        >
                            <FontAwesomeIcon icon={faThLarge} fixedWidth />
                        </div>
                    </Link>

                    {/* 가상머신 버튼 */}
                    <Link to="/computing/vms" className="link-no-underline">
                        <div
                            className={getClassNames("computing")}
                            onClick={() => {
                                handleClick("computing");
                                setSelectedDiv(null); // 선택된 div를 null로 설정하여 루틸 매니저가 선택되지 않도록 함
                            }}
                            style={{ backgroundColor: asidePopupBackgroundColor.computing }}
                        >
                            <FontAwesomeIcon icon={faDesktop} fixedWidth />
                        </div>
                    </Link>

                    {/* 네트워크 버튼 */}
                    <Link to="/networks" className="link-no-underline">
                        <div
                            className={getClassNames("network")}
                            onClick={() => {
                                handleClick("network");
                                setSelectedDiv(null); // 루틸 매니저 선택을 방지하기 위해 selectedDiv를 null로 설정
                            }}
                            style={{ backgroundColor: asidePopupBackgroundColor.network }}
                        >
                            <FontAwesomeIcon icon={faServer} fixedWidth />
                        </div>
                    </Link>

                    {/* 스토리지 버튼 */}
                    <Link to="/storages/domains" className="link-no-underline">
                        <div
                            className={getClassNames("storage")}
                            onClick={() => {
                                handleClick("storage");
                                setSelectedDiv(null); // 루틸 매니저 선택을 방지하기 위해 selectedDiv를 null로 설정
                            }}
                            style={{ backgroundColor: asidePopupBackgroundColor.storage }}
                        >
                            <FontAwesomeIcon icon={faDatabase} fixedWidth />
                        </div>
                    </Link>

                    {/* 이벤트 버튼 */}
                    <Link to="/events" className="link-no-underline">
                        <div
                            className={getClassNames("event")}
                            onClick={() => handleClick("event")}
                            style={{ backgroundColor: asidePopupBackgroundColor.event }}
                        >
                            <FontAwesomeIcon icon={faListUl} fixedWidth />
                        </div>
                    </Link>
                </div>
            </div>

            {/* 크기 조절 핸들 */}
            

            <div className="aside-popup" style={{ display: asidePopupVisible ? "block" : "none" }}>
                {renderAsidePopupContent()}
                <div ref={resizerRef} className="resizer" onMouseDown={handleMouseDown} />
            </div>
        </div>


        
        {React.cloneElement(children, { 
            activeSection, 
            setActiveSection, 
            selectedDisk, // 선택된 디스크 이름을 자식 컴포넌트로 전달
            onDiskClick: handleDetailClickStorage // 디스크 클릭 핸들러 전달
        })}

        <div className="context-menu"
                style={{
                display: contextMenuVisible ? 'block' : 'none',
                top: `${contextMenuPosition.y}px`,
                left: `${contextMenuPosition.x}px`
            }}
        >
            <div>새로 만들기</div>
            <div>새로운 도메인</div>
            <div>도메인 가져오기</div>
            <div>도메인 관리</div>
            <div>삭제</div>
            <div>Connections</div>
        </div>



      </div>
    );
}

export default MainOuter;
