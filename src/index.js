import React from 'react';
import ReactDOM from 'react-dom';
import Instalation from './utils/Instalation';

const App = () => {
  return (
  <div className="bg-slate-600">
    <Instalation />
 </div>
 )
};

 ReactDOM.render(<App />, document.getElementById('app'));