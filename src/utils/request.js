import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { ElMessage } from "element-plus";

// axios实例对象
const service = axios.create({
	baseURL: import.meta.env.VITE_APP_BASE_API,
	timeout: 20000,
});

// 请求拦截器
service.interceptors.request.use(
	(config) => {
		const store = useAuthStore();
		// 发送token
		if (store.accessToken) {
			config.headers.Authorization = "Bearer " + store.accessToken;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// 响应拦截器
service.interceptors.response.use(
	(response) => {
		// 请求成功,将response.data返回出去
		if (response.status === 200 && response.data.code === 20000) {
			return response.data;
		}
		// 非正常弹出错误信息
		ElMessage.error(response.data.message || "Error");
	},
	(error) => {
		const { message, response } = error;
		if (message.indexOf("timeout") != -1) {
			ElMessage.error("网络超时！");
		} else if (message == "Network Error") {
			ElMessage.error("网络连接错误！");
		} else {
			if (response.data) {
				ElMessage.error(response.statusText);
			} else {
				ElMessage.error("接口路径找不到");
			}
		}
		return Promise.reject(error);
	}
);
export default service;
