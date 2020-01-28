import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App.jsx';
import connect from '@vkontakte/vk-connect';

connect.send('VKWebAppInit');

ReactDOM.render(<App />, document.getElementById('root'));
