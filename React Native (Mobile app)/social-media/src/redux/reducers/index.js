import {combineReducers} from 'redux'
import UsersReducer from './UsersReducer'
import ChatReducer from './ChatReducer'

export default combineReducers({
  users: UsersReducer,
  chat: ChatReducer,
})