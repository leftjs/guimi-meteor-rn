/**
 * Created by jason on 2016/10/26.
 */
import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import Meteor, {createContainer} from 'react-native-meteor'
import { Actions, Switch, Scene, ActionConst } from 'react-native-router-flux'
import Loading from '../components/Loading'
import SignIn from '../layouts/sign/SignIn'
import ChatList from '../layouts/chat/ChatList'
import ChatDetail from '../layouts/chat/ChatDetail'
import Contact from '../layouts/contact/Contact'
import LaunchGroupChat from '../layouts/contact/LaunchGroupChat'
import Profile from '../layouts/me/Profile'
import Activity from '../layouts/activity/Activity'
import LaunchActivity from '../layouts/activity/LaunchActivity'
import Icon from 'react-native-vector-icons/Ionicons'

const TabIcon = (icon, props) => {
  return (
    <View style={{alignItems: 'center'}}>
      <Icon
        size={20}
        name={props.selected ? icon : `${icon}-outline`}
      >
      </Icon>
      <Text style={{color: props.selected ? 'red' : 'black', fontSize: 10}}>{props.title}</Text>
    </View>
  )
}


const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: '#eee'
  },
  tabBarSelectedItemStyle: {
    backgroundColor: '#fff'

  }
})
export const getSceneStyle = (props, computedProps) => {
  const style = {
    flex: 1,
    backgroundColor: 'white',
    //shadowColor: null,
    //shadowOffset: null,
    //shadowOpacity: null,
    //shadowRadius: null,
  }

  if (computedProps.isActive){
    style.marginTop = computedProps.hideNavBar ? 0 : 64
    style.marginBottom = computedProps.hideTabBar ? 0 : 50
  }
  return style
}

export const scenes =  Actions.create(
  <Scene key="root" tabs={true} tabBarStyle={styles.tabBarStyle} tabBarSelectedItemStyle={styles.tabBarSelectedItemStyle}>
    <Scene key="chat" title="聊天" icon={TabIcon.bind(this, 'ios-text')}>
      <Scene key="chatList" title="聊天列表" component={ChatList}/>
      <Scene key="chatDetail" title={(props) => props.title} component={ChatDetail} hideTabBar/>
    </Scene>
    <Scene key="contact" title="通讯录" icon={TabIcon.bind(this, 'ios-paper')}>
      <Scene key="contactList" title="通讯录" component={Contact} rightTitle="发起群聊" onRight={() => {Actions.launchGroupChat()}}/>
      <Scene key="launchGroupChat" title="选择好友" component={LaunchGroupChat}/>
    </Scene>
    <Scene key="activity" title="朋友圈" icon={TabIcon.bind(this, 'ios-aperture')}>
      <Scene key="activityList" title="朋友圈" component={Activity} rightTitle="发布" onRight={() => {Actions.launchActivity()}}/>
      <Scene key="launchActivity" title="发布" component={LaunchActivity}/>
    </Scene>
    <Scene key="me" title="我" icon={TabIcon.bind(this, 'ios-person')} component={Profile} />
  </Scene>
)