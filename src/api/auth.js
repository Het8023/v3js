import request from "@/utils/request";

/**
 * 登录接口
 * @param data
 */
export const loginApi = (data) => {
    return request("/auth/token", "POST", data);
};

/**
 * 获取用户信息
 */
export const userInfoApi = () => {
    return request("/system/menu/user", "GET");
};

/**
 * 退出登录
 */
export const logoutApi = () => {
    return request("/auth/logout", "POST");
};
