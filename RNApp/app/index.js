/**
 * Created by jason on 2016/10/25.
 */
import React from 'react'
import Meteor, {createContainer, MeteorListView} from 'react-native-meteor'
import {View, Text} from 'react-native'

import settings from './config/settings'

import {Router} from 'react-native-router-flux'
import {getSceneStyle, scenes} from './config/scenes'
import Loading from './components/Loading'
import SignIn from './layouts/sign/SignIn'

Meteor.connect(settings.METEOR_URL)

const RNApp = (props) => {
  const {status, user, loggingIn } = props
  if (status.connected === false || loggingIn) {
    return <Loading/>
  }else if (user !== null) {
    return <Router scenes={scenes} getSceneStyle={getSceneStyle} />
  }else {
    return <SignIn/>
  }
}
RNApp.propTypes = {
  status: React.PropTypes.object,
  user: React.PropTypes.object,
  loggingIn: React.PropTypes.bool,
}

export default createContainer(() => {
  return {
    status: Meteor.status(),
    user: Meteor.user(),
    loggingIn: Meteor.loggingIn()
  }
}, RNApp)

