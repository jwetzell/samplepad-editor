/* Global imports */
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';

/* App imports */
import reducers from 'state/reducers'
import { initMidiMenu } from 'util/midiMenu'

/* Component imports */
import App from 'component/App'
import 'css/index.css';

/* Initalize Electron App From Renderer Process */
initMidiMenu();

/* Initalize React App */
const store = createStore(reducers, applyMiddleware(thunk));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)