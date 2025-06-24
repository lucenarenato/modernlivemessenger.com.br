import { requestConfig } from "./config";

export const updateAvatarAndBanner = async (data) => {
    try {
        const res = await requestConfig.patch("/users", data);
        return res
    } catch (err) {
        return err.response
    }
};

export const updateStatus = async (data) => {
    try {
        const res = await requestConfig.patch("/users/status", data);
        return res
    } catch (err) {
        return err.response
    }
};

export const updateBio = async (data) => {
    try {
        const res = await requestConfig.patch("/users/bio", data);
        return res
    } catch (err) {
        return err.response
    }
};

export const updateUsername = async (data) => {
    try {
        const res = await requestConfig.patch("/users/username", data);
        return res
    } catch (err) {
        return err.response
    }
};
