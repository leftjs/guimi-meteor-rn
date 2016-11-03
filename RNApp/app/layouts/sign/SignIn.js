/**
 * Created by jason on 2016/10/25.
 */
import React from 'react'
import {View, Image, Link, TouchableOpacity, Text, StyleSheet, Dimensions, StatusBar, TextInput} from 'react-native'
import Meteor, {createContainer, Accounts} from 'react-native-meteor'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import { Kaede } from 'react-native-textinput-effects'
import colors from '../../config/colors'
import toast from '../../utils/toast'
export default class SignIn extends React.Component {
  state = {
    register: false, // 是否是注册
    username: '',
    password: ''
  }



  _handleSubmit = () => {
    let {register, username, password} = this.state
    if (register) {
      Accounts.createUser({
        username,
        password
      }, (err) => {
        if(err) {
          toast(err.message)
        }else {

        }
      })
    }else {
      Meteor.loginWithPassword({username}, password, (err) => {
        if(err) {
          toast(err.message)
        }
      })
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
        />
        <View style={styles.bigModal}/>
        <Image
          style={styles.backgroundImage}
          source={require('../../images/Background.png')}
        />

        <View style={[styles.titleContainer]}>
          <Text
            style={styles.title}
          >You may say I'm a dreamer, But I'm not the only one.</Text>

        </View>

        <View style={styles.titleContainer}>
          <Kaede
            label={'username'}
            height={50}
            autoCorrect={false}
            autoCapitalize= 'none'
            returnKeyType="next"
            onEndEditing={() => this._password._focus()}
            onChangeText={(text) => {this.setState({username: text})}}
            inputStyle={{backgroundColor: 'transparent', color: 'white', borderWidth: 1, borderColor: 'white'}}
            labelStyle={{backgroundColor: 'white', color: 'grey'}}
          />
          <Kaede
            ref={(view) => this._password = view}
            label={'password'}
            height={50}
            autoCapitalize= 'none'
            autoCorrect={false}
            secureTextEntry={true}
            onChangeText={(text) => {this.setState({password: text})}}
            inputStyle={{backgroundColor: 'transparent', color: 'white', borderWidth: 1, borderColor: 'white'}}
            labelStyle={{backgroundColor: 'white', color: 'grey'}}
          />

        </View>


        <TouchableOpacity onPress={this._handleSubmit.bind(this)}>
          <Text style={styles.signIn}>{!!this.state.register ? 'Sign Up' : 'Sign In'}</Text>
        </TouchableOpacity>
        <View style={styles.registerInContainer}>
          <View style={styles.smallModal}/>
          <Text style={styles.registerText}>{`${!!this.state.register ? 'H': 'Don\'t h'}ave an account?`}</Text>
          <TouchableOpacity onPress={() => {this.setState({register: !this.state.register})}}>
            <Text style={styles.registerIn}>{!!this.state.register ? 'Sign In' : 'Sign Up'}</Text>
          </TouchableOpacity>
        </View>
        <KeyboardSpacer/>

      </View>
    )
  }
}

const {width: screenWidth, height: screenHeight} = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: screenWidth,
    height: screenHeight
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 26,
    paddingHorizontal: 20,
  },
  signIn: {
    lineHeight: 60,
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    backgroundColor: colors.green,
    height: 60,
    width: screenWidth,
  },
  registerInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: screenWidth,
    alignItems: 'center',
    height: 60,
  },
  registerText: {
    fontSize: 14,
    color: 'white',
    backgroundColor: 'transparent',
    opacity: 0.6
  },
  registerIn: {
    marginLeft: 10,
    fontSize: 14,
    color: 'white',
    backgroundColor: 'transparent'
  },
  smallModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: 60,
    opacity: 0.4,
    backgroundColor: 'black'
  },
  bigModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 120,
    right: 0,
    backgroundColor: 'white',
    opacity: 0.7
  },
  input: {
    height: 40,
    fontSize: 24,
    borderColor: 'white',
    borderWidth: 1,
    marginHorizontal: screenWidth / 6,
    borderRadius: 5,
    padding: 10,
    color: 'white'
  }
})
