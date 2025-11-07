import { useState, useEffect } from 'react';
import { API_URL } from '@common/constants.ts';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const msg = `${data.wrld}`;
        setMessage(msg);
      })
      .catch((err) => {
        console.error('failed to fetch from server:', err);
        setMessage('failed to load data');
      });
  }, []);

  return (
    <>
      <div>hello {message}</div>
    </>
  )
}

export default App