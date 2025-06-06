import { requestConfig } from "./config";

export const loginRequest = async (credentials) => {
    try {
        const res = await requestConfig.post("/v1/login", credentials);
        return res
    } catch (err) {
        return err.response
    }
};

export const registerRequest = async (user) => {
    try {
        const res = await requestConfig.post("/v1/register", user);
        return res
    } catch (err) {
        return err.response
    }
};
