import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import connect from '@vkontakte/vk-connect';

connect.send('VKWebAppInit');

if(window.location.hash === '#debug') window.eruda.init();

ReactDOM.render(<App />, document.getElementById('root'));
