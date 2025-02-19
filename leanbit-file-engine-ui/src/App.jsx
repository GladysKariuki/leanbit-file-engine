import { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/themes/dark.css';
import SlSpinner from '@shoelace-style/shoelace/dist/react/spinner/index.js';
import SlCard from '@shoelace-style/shoelace/dist/react/card/index.js';
import SlDivider from '@shoelace-style/shoelace/dist/react/divider/index.js';
import SlBadge from '@shoelace-style/shoelace/dist/react/badge/index.js';
import SlAlert from '@shoelace-style/shoelace/dist/react/alert/index.js';
import SlDrawer from '@shoelace-style/shoelace/dist/react/drawer/index.js';
import SlButton from '@shoelace-style/shoelace/dist/react/button/index.js';
import SlIcon from '@shoelace-style/shoelace/dist/react/icon/index.js';
import SlBreadcrumb from '@shoelace-style/shoelace/dist/react/breadcrumb/index.js';
import SlBreadcrumbItem from '@shoelace-style/shoelace/dist/react/breadcrumb-item/index.js';
import SlInput from '@shoelace-style/shoelace/dist/react/input/index.js';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path';

setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.0/cdn/');

function App() {
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState('/');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fileDetails, setFileDetails] = useState({});
  const [fileData, setFileData] = useState('');
  const [errorAlert, setErrorAlert] = useState('');
  const [hoverData, setHoverData] = useState({
    visible: false,
    type: '',
    text: '',
    x: 0,
    y: 0,
    opacity: 0
  });
  const [fileFolderCardsSectionWidth, setFileFolderCardsSectionWidth] = useState(0);
  const fileFolderCardsSection = useRef(null);

  useEffect(() => {
    if (fileFolderCardsSection.current) {
      setFileFolderCardsSectionWidth(fileFolderCardsSection.current.getBoundingClientRect().width);
    }
  }, [loading]);

  const handleMouseMove = (e) => {
    if (hoverData.visible) {
      requestAnimationFrame(() => {
        setHoverData((prev) => ({
          ...prev,
          x: e.clientX + 10,
          y: e.clientY + 10,
        }));
      })
    }
  };

  const handleMouseEnter = (type, e) => {
    setHoverData({
      visible: true,
      type: type,
      text: type === 'directory' ? 'Enter Folder' : 'Open File',
      x: e.clientX + 10,
      y: e.clientY + 10,
      opacity: 1
    });
  };

  const handleMouseLeave = () => {
    setHoverData({
      visible: false,
      type: '',
      text: '',
      x: 0,
      y: 0,
      opacity: 0
    });
  };

  const handleSearchChange = useCallback((e) => {
    let value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredData(value === "" ? data : data.filter(item => item.name.toLowerCase().includes(value)));
  }, [data]);

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredData(data);
  };

  const openFile = async (filePath) => {
    setLoading(true);
    await fetch(`http://localhost:3030/api/read-file?path=${filePath}`, {
      method: 'GET',
      redirect: 'follow'
    }).then(response => {
      if (response.ok) {
        return response.text();
      }
    }).then(result => {
      setFileData(result);
      setLoading(false);
    }).catch(error => {
      console.error(error);
      setLoading(false);
    })

    await fetch(`http://localhost:3030/api/file-details?path=${filePath}`, {
      method: 'GET',
      redirect: 'follow'
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
    }).then(result => {
      setFileDetails(result);
    }).catch(error => {
      console.error(error);
    })
  };

  const goBack = () => {
    if (errorAlert.length > 0) {
      setErrorAlert('');
    }

    const pathSegments = currentPath.split('/');

    while (pathSegments[pathSegments.length - 1] === '') {
      pathSegments.pop();
      if (pathSegments.length > 1) {
        pathSegments.pop();
      }
    }

    if (fileData.length > 0) {
      setFileData('');
    }

    setCurrentPath(pathSegments.join('/') + '/');
  };

  const generateBreadcrumbs = () => {
    if (currentPath === '/') return [{ name: '/', path: '/' }];

    let parts = currentPath.split('/').filter(Boolean);
    let breadcrumbs = [];
    let pathAccumulator = '';

    parts.forEach((part, index) => {
      pathAccumulator += `/${part}`;
      breadcrumbs.push({ name: part, path: pathAccumulator });
    });

    return breadcrumbs;
  };

  const handleBreadcrumbClick = (newPath) => {
    setCurrentPath(newPath);
  };

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3030/api/files/?path=${currentPath}`, {
      method: 'GET',
      redirect: 'follow'
    }).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        setLoading(false);
        setErrorAlert('Failed to open ' + currentPath);
        return;
      }
    }).then(result => {
      setData(result);
      setFilteredData(result);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }).catch(error => {
      console.error(error);
      setLoading(false);
    });
  }, [currentPath]);

  return (
    <>
      {loading ? (
        <div
          style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <SlSpinner style={{ fontSize: '3rem' }} />
        </div>) :
        <div className='container'>
          <div className='title-section'>
            <h1>LeanBit File Engine</h1>
            {/* <p>Current Path:</p> */}
            <SlBreadcrumb>
              <span slot="separator">/</span>
              {generateBreadcrumbs().map((crumb, index) => (<>
                <SlBreadcrumbItem key={index} onClick={() => handleBreadcrumbClick(crumb.path)} className='breadcrumb-item'>
                  {crumb.name}
                </SlBreadcrumbItem>
              </>))}
            </SlBreadcrumb>
          </div>
          <div className='subtitle-section' ref={fileFolderCardsSection}>
            <h4>Files &amp; Folders</h4>
            <SlInput size='medium' pill clearable placeholder='Search...' onInput={(e) => handleSearchChange(e)}>
              <SlIcon name='search' className='search-icon' slot="suffix"></SlIcon>
            </SlInput>
          </div>
          {currentPath !== '/' && (
            <SlButton variant='neutral' style={{ paddingTop: '32px' }} onClick={goBack}>
              <SlIcon slot="prefix" name='arrow-left'></SlIcon>
              Back
            </SlButton>
          )}
          <SlAlert open={errorAlert.length > 0} variant="danger" style={{ marginTop: '32px' }} onSlAfterHide={() => setErrorAlert('')}>
            <SlIcon name='ban' style={{ color: 'red', fontSize: '24px' }} slot='icon' />
            {errorAlert}
          </SlAlert>
          {errorAlert.length <= 0 &&
            <>
              <div className='files-and-folders-section'>
                {filteredData.length === 0 ? (
                  <p>No files or folders</p>
                ) : (
                    filteredData.map((apiData, index) => (
                    <SlCard key={index}
                      className='file-directory-card'
                      onMouseEnter={(e) => handleMouseEnter(apiData.type, e)}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={handleMouseMove}
                      onClick={apiData.type === 'file' ? () => openFile(currentPath + apiData.name) : () => setCurrentPath(currentPath + apiData.name + '/')}>
                      <p>Name:</p>
                      <strong>{apiData.name}</strong>
                      <SlDivider></SlDivider>
                      <p>Type: <strong>{apiData.type}</strong></p>
                    </SlCard>
                  ))
                )}
                {hoverData.visible && (
                  <SlBadge
                    variant={hoverData.type === 'directory' ? 'primary' : 'success'}
                    style={{
                      position: 'fixed',
                      left: `${hoverData.x}px`,
                      top: `${hoverData.y}px`,
                      pointerEvents: 'none',
                      opacity: `${hoverData.opacity}`
                    }}>
                    {hoverData.text}
                  </SlBadge>
                )}
              </div>
              <SlDrawer label={fileDetails.name} open={fileData.length > 0} style={{ '--size': '50vw' }} onSlAfterHide={() => setFileData('')}>
                <pre style={{ whiteSpace: "pre-wrap" }}>{fileData}</pre>
              </SlDrawer>
            </>
          }
        </div>
      }
    </>
  );
}

export default App