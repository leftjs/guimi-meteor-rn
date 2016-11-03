/**
 * Created by jason on 2016/10/26.
 */
import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import {List, ListItem} from 'react-native-elements'
import Meteor, {connectMeteor} from 'react-native-meteor'
import {Actions} from 'react-native-router-flux'


@connectMeteor
class ChatList extends React.Component {

  getMeteorData() {
    Meteor.subscribe('allUsers')
    Meteor.subscribe('relatedChats', Meteor.userId())
    return {
      chats: Meteor.collection('chats').find({members: {$in : [Meteor.userId()]}}).map((item) => {
        return {
          ...item,
          members: item.members.map((userId) => {
            return Meteor.collection('users').findOne({_id: userId})
          })
        }
      })
    }
  }

  render() {
    return (
      <List>
        {
          this.data.chats.map((chat, index) => {
            // fix title
            let title = ''
            if (chat.members.length === 2) {
              for (let member of chat.members) {
                if (!!member && member._id !== Meteor.userId()) {
                  title = member.username
                }
              }
            }else {
              title = chat.title
            }
            return (
              <ListItem
                roundAvatar
                avatar={{uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg'}}
                key={index}
                title={title}
                onPress={() => {
                  Actions.chatDetail({chatId: chat._id, title})
                }}
              />
            )
          })
        }
      </List>
    )
  }
}


export default ChatList