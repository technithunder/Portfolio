export const CHAT_GET_CONVERSATION = 'chat_get_conversation';
export const CHAT_CREATE_PURGE_USERS = 'chat_create_purge_users';
export const CHAT_APPEND_MESSAGE = 'chat_append_message';
export const CHAT_GET_CONVERSATION_FROM_NOTIFICATION = 'chat_from_notification';
import axios from 'axios';
import moment from 'moment';
import { BASE_URL } from '../../../helper/constants';

const createHeaders = (token) => ({
    'Content-Type': 'application/json',
    Authorization: `BasicCustom ${token}`,
});

export function getChat(token, conversationId) {
    return (dispatch, getState, api) => {
        return new Promise((resolve, reject) => {
            axios.get(`${BASE_URL}Conversation/GetUserMessagesByConversation?ConversationId=${conversationId}`, {
                headers: createHeaders(token),
            }).then(res => {
                if (res.data.status == 200) {
                    console.log(res.data.data);
                    dispatch({ type: CHAT_GET_CONVERSATION, payload: { messages: res.data.data, conversationId } });
                    resolve()
                } else {
                    resolve(res.data.status);
                }
            }).catch(err => {
                console.log(err);
                dispatch({ type: CHAT_GET_CONVERSATION, payload: [] });
                reject()
            })
        });
    };
}

export function getChatFromNotification(data) {
    return (dispatch, getState, api) => {
        const { ConversationId } = data;
        dispatch({ type: CHAT_GET_CONVERSATION_FROM_NOTIFICATION, payload: { conversationId: ConversationId, data } });
    };
}

export function sendMessage(userKey, token, username, conversationId, message, ReceiverId) {
    return (dispatch, getState, api) => {
        return new Promise((resolve, reject) => {
            const obj = {
                'SenderId': userKey,
                'ReceiverId': ReceiverId,
                'ConversationId': conversationId,
                'chatOwnerId': userKey,
                'Message': message,
            }
            axios.post(`${BASE_URL}Conversation/SaveMessage`, obj, { headers: createHeaders(token) })
                .then((res) => {
                    if (res.data.status === 200) {
                        dispatch({ type: CHAT_APPEND_MESSAGE, payload: { conversationId, data: res.data.data.data.messageDetail } });
                        resolve(message);
                    } else {
                        resolve(res.data.status);
                    }
                })
                .catch((e) => {
                   console.log(e);
                });
        });
    }
}
