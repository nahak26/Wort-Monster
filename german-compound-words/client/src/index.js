import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
/*
function DbTest() {
  const [dictionary, setDictionary] = useState([]);

  useEffect(() => {
    const fetchDictionary = async () => {
      const words = await getAllWords();
      console.log("Words:", words);
      setDictionary(words);
    };
    fetchDictionary();
  }, []);

  return (
    <div className="DbTest">
      <h1>Words:</h1>
      {dictionary.length === 0 ? (
        <p>No words found.</p>
      ) : (
        <ul>
          {dictionary.map((word) => (
            <li key={word.id}>
              <strong>{word.word}</strong>: {word.definition} <br />
              <em>Sub Words:</em> {word.sub_words}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DbTest;
*/
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
