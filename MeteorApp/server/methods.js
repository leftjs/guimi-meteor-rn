/**
 * Created by jason on 2016/10/27.
 */
import {Meteor} from 'meteor/meteor'
import * as collections from '../lib/collections'
export default () => {
  return Meteor.methods({
    'friends.add': async (ownerId, friendId) => {
      let Friends = collections.Friends
      let friend = Friends.findOne({ownerId, friendId})
      if ((!!friend && friend.ownerId === ownerId && friend.friendId === friendId) || (!!friend && friend.ownerId === friendId && friend.friendId === ownerId)) {
        throw new Meteor.Error('请不要重复申请/添加')
      }
      try {
        return await wrapCallbackWithPromise(Friends.insert.bind(Friends), {ownerId, friendId, active: false})
      } catch (err) {
        throw new Meteor.Error(err.message)
      }
    },
    'friends.remove': async (id) => {
      let Friends = collections.Friends
      try {
        return await wrapCallbackWithPromise(Friends.remove.bind(Friends), {_id: id})
      }catch(err) {
        throw new Meteor.Error(err.message)
      }
    },
    'friends.accept': async (id) => {
      let Friends = collections.Friends
      try {
        return await wrapCallbackWithPromise(Friends.update.bind(Friends), {_id: id}, {$set: {active: true}})
      } catch(err) {
        throw new Meteor.Error(err.message)
      }
    },
    'user.avatarUpload': async (data) => {
      let Users = Meteor.users
      try {
        return await wrapCallbackWithPromise(Users.update.bind(Users), {_id: Meteor.userId()}, {$set: {avatar: data}})
      } catch (err) {
        throw new Meteor.Error(err.message)
      }
    },
    'chats.add': async (ids) => {
      let members = _.uniq([Meteor.userId(), ...ids])
      console.log(members)
      let Friends = collections.Friends
      let Chats = collections.Chats
      let friend

      // 修正群聊和私聊的title
      let title = ''
      for (let member of members) {
        member = Meteor.users.findOne({_id: member})
        if (!!member && member._id !== Meteor.userId()) {
          title += `丶${member.username}`
        }
      }
      title = !!title && title.substr(1, title.length)
      console.log(title)
      if (members.length > 2) {
        if (title.length > 10) {
          title = `${title.substr(0, 10)}...等${members.length - 1}人`
        }else {
          title = `${title}等${members.length - 1}人`
        }
      }else {
        title = '私聊'
      }

      if(members.length === 2) {
        friend = Friends.findOne({$or: [
          {ownerId: members[0], friendId: members[1]},
          {ownerId: members[1], friendId: members[0]}
        ]})
        if (!!friend.chatId) {
          let chat =  Chats.findOne({_id: friend.chatId})
          let title
          for (let member of members) {
            if (member !== Meteor.userId()) {
              title = Meteor.users.findOne({_id: member}).username
            }
          }
          return {
            ...chat,
            title
          }
        }
      }
      try {
        let chatId = await wrapCallbackWithPromise(Chats.insert.bind(Chats), {members, title})
        if (members.length === 2) {
          let result = await wrapCallbackWithPromise(Friends.update.bind(Friends), {_id: friend._id}, {$set: {chatId}})
          let chat = Chats.findOne({_id: chatId})
          let title
          for (let member of members) {
            if (member !== Meteor.userId()) {
              title = Meteor.users.findOne({_id: member}).username
            }
          }
          return {
            ...chat,
            title
          }
        }else {
          return Chats.findOne({_id: chatId})
        }

      } catch (err) {
        throw new Meteor.Error()
      }
    },
    'messages.add': async (chatId, text) => {
      let Messages = collections.Messages
      return await wrapCallbackWithPromise(Messages.insert.bind(Messages), {chatId, text, createdAt: new Date(), user: Meteor.userId()})
    },
    'activities.add': async (content) => {
      let Activities = collections.Activities
      return await wrapCallbackWithPromise(Activities.insert.bind(Activities), {owner: Meteor.userId(), content, createdAt: new Date()})
    },
    'activities.comment': async (activityId, comment) => {
      let Activities = collections.Activities
      return await wrapCallbackWithPromise(Activities.update.bind(Activities), {_id: activityId}, {$push: {comments: {comment, createdAt: new Date(), owner: Meteor.userId() }}})
    }
  })
}


const wrapCallbackWithPromise = (func, ...params) => {
  return new Promise((resolve, reject) => {
    func.call(this, ...params, (err, result) => {
      if (err) {
        reject(err)
      }else {
        resolve(result)
      }
    })
  })
}

