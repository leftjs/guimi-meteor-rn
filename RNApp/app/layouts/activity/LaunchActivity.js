/**
 * Created by jason on 2016/10/31.
 */
import React from 'react'
import {View, Text, TextInput, Dimensions, TouchableOpacity} from 'react-native'
import colors from '../../config/colors'
import Meteor from 'react-native-meteor'
import toast from '../../utils/toast'
import {Actions} from 'react-native-router-flux'
const {width, height} = Dimensions.get('window')

class LaunchActivity extends React.Component{
  state = {
    content: ''
  }


  render() {
    return (
      <View style={{flex: 1}}>
        <TextInput
          blurOnSubmit={true}
          style={{
            width,
            fontSize: 18,
            lineHeight: 18,
            height: 150,
            backgroundColor: 'lightgrey'
          }}
          value={this.state.content}
          multiline={true}
          onChangeText={(content) => {
            if (content.length > 150){
              return
            }
            this.setState({content})
          }}
        />
        <Text style={{textAlign: 'right', marginRight: 20, marginTop: 10,}}>{`${150 - this.state.content.length}/150字`}</Text>
        <TouchableOpacity
          onPress={() => {
            Meteor.call('activities.add', this.state.content, (err, result) => {
              if (err) {
                toast(err.message)
              }else {
                Actions.pop()
              }
            })
          }}
          style={{position: 'absolute', bottom: 0, width, height: 50, backgroundColor: colors.green, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: 'white', fontSize: 15}}>发布</Text>
        </TouchableOpacity>
      </View>
    )
  }
}



export default LaunchActivity