import React from 'react';
import ReactDOM from 'react-dom';
import Instalation from './utils/Instalation';

const App = () => {
  return (
  <div className="bg-slate-600">
    <h1 className="inline-flex items-center gap-x-1.5 rounded-full bg-yellow-100 px-1.5 py-0.5 text-xs font-medium text-yellow-800">Hola desde React y Electron!</h1>
    <button
      type="button"
      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
    Button text
    </button>
    <br/>
    <button 
      /* className="bg-gray-300 border-2 border-gray-500 text-black px-4 py-2 focus:outline-none active:translate-y-1 active:translate-x-1 active:border-gray-400 active:bg-gray-400"  */
      /* className="bg-gray-200 border-2 border-gray-400 text-black rounded px-4 py-2 focus:outline-none active:translate-y-px active:translate-x-px active:border-gray-300 active:bg-gray-300"  */
      className="bg-blue-500 border border-blue-700 text-white rounded px-4 py-2 focus:outline-none active:bg-blue-700 active:border-blue-900" 
      >
      Crear Estructura
    </button>
    <Instalation />
 </div>
 )
};

 ReactDOM.render(<App />, document.getElementById('app'));