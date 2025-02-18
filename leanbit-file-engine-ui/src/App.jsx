import { useState, useEffect } from 'react';
import './App.css';
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/themes/dark.css';
import SlCard from '@shoelace-style/shoelace/dist/components/card/card.js';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path';

setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.20.0/cdn/');

function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3030/api/files/?path=${currentPath}`, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        contentType: 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
    }).then(result => {
      console.log(result);
      setData(result);
    }).catch(error => {
      console.error(error);
    })
  }, [currentPath]);

  return (
    <>
      <div className='container'>
        <div className='title-section'>
          <h1>LeanBit File Engine</h1>
          <p>Current Path: {currentPath}</p>
        </div>
        <div className='subtitle-section'>
          <h4>Files &amp; Folders</h4>
        </div>
        <div className='files-and-folders-section'>
          {data.length === 0 ? (
            <p>No files or folders</p>
          ) : (data.map((apiData, index) => (
            <sl-card key={index}>
              <p>{apiData.name}</p>
            </sl-card>
          )))}
        </div>
      </div>
    </>
  );
}

export default App
