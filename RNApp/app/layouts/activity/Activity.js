/**
 * Created by jason on 2016/10/31.
 */
import React from 'react'
import {View, Text, Image, TextInput, ScrollView, Dimensions, Keyboard, TouchableOpacity} from 'react-native'
import {List, ListItem} from 'react-native-elements'
import Meteor, {connectMeteor} from 'react-native-meteor'
import Icon from 'react-native-vector-icons/Ionicons'
import colors from '../../config/colors'
import moment from 'moment'

import KeyboardResponsiveView from 'react-native-keyboard-responsive-view'


const {width, height} = Dimensions.get('window')

@connectMeteor
class Activity extends React.Component{

  state = {
    comment: '',
    activityId: ''
  }



  getMeteorData() {
    Meteor.subscribe('allUsers')
    Meteor.subscribe('relatedActivities')
    return {
      activities: Meteor.collection('activities').find().map((activity) => {
        return {
          ...activity,
          owner: Meteor.collection('users').findOne({_id: activity.owner}),
          comments: !!activity.comments && activity.comments.map((comment) => {
            return {
              ...comment,
              owner: Meteor.collection('users').findOne({_id: comment.owner})
            }
          })
        }
      })
    }
  }


  renderActivity = (activity) => {
    let comments = activity.comments || []
    return(

      <View style={{padding: 20, borderBottomWidth: 1, borderColor: 'lightgrey', }}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={{uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg'}}
            style={{width: 50, height: 50, borderRadius: 25}}
          />
          <View style={{marginLeft: 20, flex: 1}} >
            <View style={{height: 50, justifyContent: 'flex-start'}}>
              <Text>{activity.owner.username}</Text>
              <Text style={{color: 'grey'}}>{moment(activity.createdAt).fromNow()}</Text>
            </View>
            <Text>{activity.content}</Text>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
              <Icon name="ios-chatbubbles-outline"
                    size={20}
                    style={{marginHorizontal: 10}}
                    onPress={() => {this.setState({activityId: activity._id})}} />
              <Icon name="ios-thumbs-up-outline" style={{marginHorizontal: 10}} size={20} onPress={() => {console.log('asdf')}}/>
            </View>
          </View>
        </View>
        {
          comments.length > 0 && <View style={{backgroundColor: 'lightgrey', marginTop: 10, padding:10, borderRadius: 10}}>
            {
              comments.map((comment, index) => {
                return (
                  <View key={index}>
                    <View style={{flexDirection: 'row', }}>
                      <TouchableOpacity>
                        <Text style={{color: 'blue'}}>
                          {comment.owner.username}:
                        </Text>
                      </TouchableOpacity>
                      <Text style={{marginLeft: 2}}>{comment.comment}</Text>
                    </View>
                    <Text style={{textAlign:'right', color: 'grey'}}>{moment(comment.createdAt).fromNow()}</Text>
                  </View>
                )
              })
            }
          </View>
        }

      </View>
    )
  }


  render(){
    return (
      <KeyboardResponsiveView>
        <ScrollView>
          <List containerStyle={{borderColor: 'transparent'}}>
            {
              this.data.activities.map((activity, index) => {
                return (
                  <ListItem
                    key={index}
                    component={this.renderActivity.bind(this, activity)}
                  />
                )
              })
            }
          </List>
        </ScrollView>
        {
          !!this.state.activityId &&
          <View style={{flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderTopColor: 'lightgrey', borderBottomColor: 'lightgrey'}}>
            <TextInput
              onBlur={() => {this.setState({activityId: ''})}}
              onChangeText={(comment) => {this.setState({comment})}}
              value={this.state.comment}
              autoFocus={true}
              style={{ flex: 1, height: 44, backgroundColor: 'lightgrey', margin: 10,  paddingHorizontal: 10, borderRadius: 10,}}
            />
            <Icon
              style={{marginRight: 20, backgroundColor: 'transparent', borderColor: 'transparent'}}
              name="ios-paper-plane-outline"
              size={30}
              onPress={() => {
                if (this.state.comment.trim().length === 0) {
                  return
                }
                Meteor.call('activities.comment', this.state.activityId, this.state.comment)
                this.setState({
                  activityId: '',
                  comment: ''
                })
              }}
            />
          </View>
        }
      </KeyboardResponsiveView>
    )
  }
}




export default Activity