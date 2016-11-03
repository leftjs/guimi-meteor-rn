/**
 * Created by jason on 2016/10/30.
 */
import React from 'react'
import {View, Text, Image, Dimensions, TouchableOpacity} from 'react-native'
import Meteor from 'react-native-meteor'
import { Button } from 'react-native-elements'

const {width, height} = Dimensions.get('window')

export default class Profile extends React.Component {
  _handleSelectAvatar = () => {
  }
  render(){
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={this._handleSelectAvatar.bind(this)}>
          <Image
            style={{width: width / 2, height: width / 2, borderRadius: width / 4, borderWidth: 2, borderColor: 'pink'}}
            source={{uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg'}}
            onPress={() =>{console.log('asdf')}}
          />
        </TouchableOpacity>
        <Text style={{fontSize: 25, marginTop: 15}}>{Meteor.user().username}</Text>
        <Text>这家伙很懒，什么也没说~~~</Text>
        <Button title="注销" buttonStyle={{marginTop: 20, paddingHorizontal: width / 2  - 15,  backgroundColor: 'red'}} onPress={() => {Meteor.logout()}}/>
      </View>
    )
  }
}