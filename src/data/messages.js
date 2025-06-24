import { requestConfig } from "./config";

export const sendMessage = async (data) => {
    try {
        const res = await requestConfig.post("/messages", data);
        return res
    } catch (err) {
        return err.response
    }
};

export const getMessages = async (chat_id) => {
    try {
        const res = await requestConfig.get(`/messages/chat/${chat_id}`);
        return res
    } catch (err) {
        return err.response
    }
};

export const UnreadMessages = async (data) => {
    try {
        const res = await requestConfig.get("/unread-messages/reset", data);
        return res
    } catch (err) {
        return err.response
    }
};