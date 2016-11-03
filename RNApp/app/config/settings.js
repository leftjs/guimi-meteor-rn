/**
 * Created by jason on 2016/10/25.
 */
let env = process.env.NODE_ENV
export default {
  METEOR_URL: env !== 'production' ? 'ws://127.0.0.1:3000/websocket' : '',
  //METEOR_URL: env !== 'production' ? 'ws://192.168.43.104:3000/websocket' : '',
  env
}