import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import Admin from './components/Admin';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <BrowserRouter>
      <div className="route-wrapper">
        <Route exact path="/" component={App} />
        <Route path="/map" component={App} />
        <Route path="/admin" component={Admin} />
      </div>
    </BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
