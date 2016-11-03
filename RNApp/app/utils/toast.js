/**
 * Created by jason on 2016/10/25.
 */
import Toast from 'react-native-root-toast'

export default (message = "this is a toast", config = {}) => {
  let {duration = Toast.durations.SHORT, position = Toast.positions.CENTER, onHide = () => {}} = config
  Toast.show(message, {
    duration,
    position,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
    onHide
  })
}