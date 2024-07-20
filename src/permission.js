import router from "@/router";
import { useAuthStore } from "@/stores/auth";

const whiteList = ["/login", "/404", "/401"];

/**
 * 页面鉴权
 */
router.beforeEach(async (to, from, next) => {
    const store = useAuthStore();
    const accessToken = store.accessToken;
    if (accessToken) {
        if (to.path === "/login") {
            return next({ path: "/" });
        } else {
            if (!store.userInfo || store.menuList.length <= 0 || store.buttonList.length <= 0) {
                // 获取用户信息和权限信息
                const res = await store.getUserInfo();
                if (res.data) {
                    return next({ path: to.path, query: to.query });
                } else {
                    return next(`/login?redirect=${to.path}`);
                }
                // next({ path: to.path, query: to.query })
                // next(to.path)
            } else {
                // 有用户信息和权限信息，则跳转到目标路由
                return next();
            }
        }
    } else {
        // 没有token
        if (whiteList.indexOf(to.path) !== -1) {
            return next();
        } else {
            return next(`/login?redirect=${to.path}`);
        }
    }
});
