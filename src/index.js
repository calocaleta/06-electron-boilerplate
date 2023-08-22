import React from 'react';
import ReactDOM from 'react-dom';
import Instalation from './utils/Instalation';

const App = () => {
  return (
  <div>
    <h1 className="inline-flex items-center gap-x-1.5 rounded-full bg-yellow-100 px-1.5 py-0.5 text-xs font-medium text-yellow-800">Hola desde React y Electron!</h1>
    <button
    type="button"
    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
    Button text
    </button>
    <Instalation />
 </div>
 )
};

 ReactDOM.render(<App />, document.getElementById('app'));