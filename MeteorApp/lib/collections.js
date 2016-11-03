/**
 * Created by jason on 2016/10/25.
 */

import { Mongo } from 'meteor/mongo'
export const Friends = new Mongo.Collection('friends')
export const Chats = new Mongo.Collection('chats')
export const Messages = new Mongo.Collection('messages')
export const Activities = new Mongo.Collection('activities')