import { Meteor } from 'meteor/meteor';
import publications from './publications'
import methods from './methods'
import {seed} from './seeds'



Meteor.startup(() => {
  // code to run on server at startup
  publications()
  methods()
  seed()
});


