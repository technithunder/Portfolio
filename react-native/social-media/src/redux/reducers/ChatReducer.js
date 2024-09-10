import {
  CHAT_GET_CONVERSATION,
  CHAT_APPEND_MESSAGE,
  CHAT_GET_CONVERSATION_FROM_NOTIFICATION,
} from '../actions/chat';

const initialState = {
  isEmpty: true,
  emptyReason: 'No messages',
  conversations: {},
  createConversationUsers: new Map(),
  currentConversationId: -1,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CHAT_GET_CONVERSATION:
      return Object.assign({}, state, {
        currentConversationId: action.payload.conversationId,
        conversations: {
          ...state.conversations, ...{
            [action.payload.conversationId]: {
              messages: [...action.payload.messages],
            }
          }
        }
      });
    case CHAT_GET_CONVERSATION_FROM_NOTIFICATION:
      return Object.assign({}, state, {
        conversations: {
          ...state.conversations, ...{
            [action.payload.conversationId]: {
              ...state.conversations[action.payload.conversationId],
              messages: [action.payload.data, ...state.conversations[action.payload.conversationId].messages]
            }
          }
        }
      });
    case CHAT_APPEND_MESSAGE:
      return Object.assign({}, state, {
        conversations: {
          ...state.conversations, ...{
            [action.payload.conversationId]: {
              ...state.conversations[action.payload.conversationId],
              messages: [action.payload.data, ...state.conversations[action.payload.conversationId].messages]
            }
          }
        }
      });
    default:
      return state;
  }
};
