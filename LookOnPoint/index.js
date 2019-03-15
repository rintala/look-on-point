import React, {Component} from 'react'
import {AppRegistry} from 'react-native'
import {Provider} from 'react-redux'

import App from './App'

import configureStore from './store/store.js'
const store = configureStore()

class LookOnPointApp extends Component {
  render() {
    return(
      // <Provider> allows us to access the store for dispatching actions and receiving data from
      // the state in it's children i.e. <App/>
      <Provider store={store}>
        <App/>
      </Provider>
    )
  }
}

AppRegistry.registerComponent('LookOnPoint', () => LookOnPointApp)