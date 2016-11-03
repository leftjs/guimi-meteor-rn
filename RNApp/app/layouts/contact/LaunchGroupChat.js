/**
 * Created by jason on 2016/10/31.
 */
import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import Meteor, {connectMeteor} from 'react-native-meteor'
import {List, ListItem} from 'react-native-elements'
import colors from '../../config/colors'
import toast from '../../utils/toast'


@connectMeteor
class LaunchGroupChat extends React.Component {

  state = {
    ids : []
  }



  getMeteorData(){
    Meteor.subscribe('allUsers')
    Meteor.subscribe('relatedFriends', Meteor.userId())
    return {
      myFriends: Meteor.collection('friends').find({$or: [
        {ownerId: Meteor.userId()},
        {friendId: Meteor.userId()}
      ], active: true}).map((friend) =>{
        return {
          ...friend,
          owner: Meteor.collection('users').findOne({_id: friend.ownerId}),
          friend: Meteor.collection('users').findOne({_id: friend.friendId})
        }
      })
    }
  }

  _handleFriendClick = (id) => {
    let {ids} = this.state
    let index = ids.indexOf(id)
    if (index > -1) {
      ids.splice(index, 1)
    }else {
      ids.splice(0, 0, id)
    }

    this.setState({
      ids: [...ids]
    })
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {Meteor.call('chats.add', [...this.state.ids], (err, result) => {
            if (err) {
              toast(err.message)
            } else {
              console.log(result)
            }
          })}}
          disabled={this.state.ids.length === 0}
          style={{height: 44, backgroundColor: colors.green, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: 'white'}}>已选择 {this.state.ids.length} 个好友,发起群聊</Text>
        </TouchableOpacity>
        <List containerStyle={{marginTop: 0}}>
          {
            this.data.myFriends.map((friend, index) => {
              let inlineUser = friend.ownerId === Meteor.userId() ? friend.friend : friend.owner
              return (
                <ListItem
                  roundAvatar
                  avatar={{uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg'}}
                  key={index}
                  hideChevron={this.state.ids.indexOf(inlineUser._id) > -1 ? false : true}
                  rightIcon={{name: 'check-circle', color: colors.green}}
                  title={inlineUser.username}
                  subtitle="这家伙很懒,什么也没说"
                  onPress={this._handleFriendClick.bind(this, inlineUser._id)}
                />
              )
            })
          }
        </List>
      </View>
    )
  }
}


export default LaunchGroupChat