/**
 * Created by jason on 2016/10/25.
 */
import { Meteor } from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'
import * as collections from '../lib/collections'
export default () => {
  // 所有用户列表
  Meteor.publish('allUsers', () => {
    return Meteor.users.find()
  })
  // 跟某用户相关的联系人
  Meteor.publish('relatedFriends', (userId) => {
    return collections.Friends.find({$or: [
      {ownerId: userId},
      {friendId: userId}
    ]})
  })
  Meteor.publish('relatedChats', (userId) => {
    return collections.Chats.find({members: {$in : [userId]}})
  })
  Meteor.publishComposite('chatMessages', (chatId) => {
    return {
      find: () => {
        return collections.Messages.find({chatId})
      },
      children: [
        {
          find: (chat) => {
            return Meteor.users.find({_id: chat.user})
          }
        }
      ]
    }
  })

  Meteor.publish('relatedActivities', function() {
    let friends = collections.Friends.find({$or: [
      {ownerId: this.userId},
      {friendId: this.userId}
    ]}).fetch()
    friends = _.uniq(_.flatten(friends.map((friend) => {
      return [friend.ownerId, friend.friendId]
    })))
    return collections.Activities.find({owner: {$in:[...friends]}})
  })
}