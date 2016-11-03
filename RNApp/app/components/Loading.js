/**
 * Created by jason on 2016/10/26.
 */
import React from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import colors from '../config/colors'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
})

const Loading = (props) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        animating
        size={props.size}
        {...props}
      />
    </View>
  )
}


Loading.propTypes = {
  size: React.PropTypes.string
}

Loading.defaultProps = {
  size: 'large'
}

export default Loading