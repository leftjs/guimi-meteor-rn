/**
 * Created by jason on 2016/10/27.
 */
import React, {PropTypes, Component} from 'react'
import {View, Text, Alert, TextInput, ScrollView, TouchableOpacity} from 'react-native'
import {List, ListItem, CheckBox, Button} from 'react-native-elements'
import {SearchBar} from 'react-native-elements'
import Meteor, {MeteorListView, MeteorComplexListView, connectMeteor} from 'react-native-meteor'
import toast from '../../utils/toast'
import Swipeout from '../../components/Swipeout'
import {Actions} from 'react-native-router-flux'
import colors from '../../config/colors'
@connectMeteor
class Contact extends Component{

  state = {
    searchText: '',
  }

  componentDidMount() {
  }
  getMeteorData() {
    Meteor.subscribe('allUsers')
    Meteor.subscribe('relatedFriends', Meteor.user()._id)
    const populateUser = (item) => {
      return {
        ...item,
        owner: Meteor.collection('users').findOne({_id: item.ownerId}),
        friend: Meteor.collection('users').findOne({_id: item.friendId})
      }
    }
    return {
      allUsers: Meteor.collection('users').find(),
      preparedFriends: Meteor.collection('friends').find({$or: [{ownerId: Meteor.userId()}, {friendId: Meteor.userId()}], active: false}).map(populateUser),
      isFriends: Meteor.collection('friends').find({$or: [{ownerId: Meteor.userId()}, {friendId: Meteor.userId()}], active: true}).map(populateUser)
    }
  }




  render() {
    return (
      <ScrollView>
        <SearchBar lightTheme onChangeText={(searchText) => {this.setState({searchText})}} placeholder="用户名"/>
        <Text>申请列表</Text>
        <List containerStyle={{marginTop: 0}}>
          {
            this.data.preparedFriends.map((item, index) => {
              const removeButton = {
                text: '删除',
                type: 'default',
                backgroundColor: 'red',
                onPress: () => {
                  Meteor.call('friends.remove', item._id, (err, result) => {
                    if (err) toast(err.message)
                  })
                }
              }
              const acceptButton = {
                text: '接受',
                background: 'green',
                type: 'default',
                onPress: () => {
                  Meteor.call('friends.accept', item._id, (err, result) => {
                    if (err) toast(err)
                  })
                }
              }

              return (
                <Swipeout right={item.ownerId === Meteor.user()._id ? [removeButton] : [acceptButton, removeButton]} key={index} backgroundColor="white" autoClose={true}>
                  <ListItem
                    roundAvatar
                    avatar={{uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg'}}
                    key={index}
                    title={item.ownerId === Meteor.user()._id ? item.friend.username : item.owner.username}
                    subtitle={item.ownerId === Meteor.user()._id ? '请求中...' : '等待接受...'}
                  />
                </Swipeout>
              )
            })
          }
        </List>
        <Text>我的好友</Text>
        <List containerStyle={{marginTop: 0}}>
          {
            this.data.isFriends.map((item, index) => {
              return (
                <ListItem
                  containerStyle={{flex: 1}}
                  roundAvatar
                  avatar={{uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg'}}
                  key={index}
                  title={item.ownerId === Meteor.user()._id ? item.friend.username : item.owner.username}
                  subtitle="这家伙很懒,什么也没说"
                  onPress={() => {
                  Meteor.call('chats.add', [item.ownerId, item.friendId], (err,result) =>{

                    if (err) {
                      toast(err.message)
                    } else {
                      Actions.chatDetail({chatId: result._id, title: result.title})
                    }
                  })
                }}
                />
              )
            })

          }
        </List>
        <Text>所有好友</Text>
        <List containerStyle={{marginTop: 0}}>
          {
            this.data.allUsers.filter((item) => {
              let reg = new RegExp(`.*${this.state.searchText}.*`)
              return reg.test(item.username) && item.username !== Meteor.user().username
            }).map((item, index) => {
              return (
                <ListItem
                  roundAvatar
                  avatar={{uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg'}}
                  key={index}
                  title={item.username}
                  subtitle="这家伙很懒,什么也没说"
                  onPress={()=> {
                   Alert.alert(
                    '添加好友',
                    `您确定要向 ${item.username} 发送好友申请么？`,
                    [
                      {text: '取消', onPress: () => {}},
                      {text: '确定', onPress: () => {Meteor.call('friends.add', Meteor.userId(), item._id, (err,result) => {
                        if(err){
                          toast(err.error)
                        }else {
                          toast('申请成功')
                        }
                      })}},
                     ]
                   )
                  }}
                />
              )
            })
          }
        </List>
      </ScrollView>
    )
  }
}



export default Contact

