/**
 * Created by jason on 2016/10/26.
 */
import React from 'react'
import {View, Text} from 'react-native'
import Meteor, {connectMeteor} from 'react-native-meteor'
import {GiftedChat, Bubble} from 'react-native-gifted-chat'


@connectMeteor
class ChatDetail extends React.Component {

  getMeteorData() {
    Meteor.subscribe("chatMessages", this.props.chatId)
    return {
      list: Meteor.collection('messages').find({}, {sort: {createdAt: -1}}).map((item) => {
        let user = Meteor.collection('users').findOne({_id: item.user})
        return {
          ...item,
          user: {
            _id: user._id,
            name: user.username,
            avatar: user.avatar || "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg"
          }
        }
      })
    }
  }


  _handleSendMessage = (messages = []) => {
    messages.map((message) => {
      Meteor.call('messages.add',this.props.chatId, message.text)
    })
  }

  renderBubble(props) {
    return (
      <View>
        {
          props.position === 'left' ? <Text style={{position: 'absolute', top: 10, color: 'grey'}}>{props.currentMessage.user.name}</Text> : null
        }
        <Bubble
          {...props}
          containerStyle={{
            left: {top: 20}
          }}
          wrapperStyle={{
            left: {
              marginVertical: 10,
              backgroundColor: '#f0f0f0',
            }
          }}
        />
      </View>
    );
  }



  render() {
    return (
      <GiftedChat
        messages={this.data.list}
        onSend={this._handleSendMessage}
        user={{
          _id: Meteor.userId(),
          name: Meteor.user().username,
          avatar: Meteor.avatar || "https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg"
        }}
        renderBubble={this.renderBubble}
      />
    )
  }
}

export default ChatDetail