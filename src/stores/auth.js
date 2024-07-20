import { defineStore } from "pinia";
import { ref } from "vue";
import { loginApi, logoutApi, userInfoApi } from "@/api/auth";
import router from "@/router";

export const useAuthStore = defineStore(
    "auth",
    () => {
        // token
        const accessToken = ref("");
        // 用户信息
        const userInfo = ref();
        // 菜单数据
        const menuList = ref([]);
        // 按钮权限数据
        const buttonList = ref([]);
        // 用户名与密码的数据
        const rememberData = ref();

        // 保存需要缓存的name名称
        const cacheName = ref([]);

        // 登录操作
        const login = async (data) => {
            try {
                const res = await loginApi(data);
                accessToken.value = res.data.access_token;
                return res;
            } catch (e) {
                console.log(e);
            }
        };

        // 退出登录操作
        const logout = async () => {
            try {
                const res = await logoutApi();
                // 1. 清空token, 以及 用户信息还有权限相关数据
                accessToken.value = undefined;
                userInfo.value = undefined;
                menuList.value = [];
                buttonList.value = [];
                cacheName.value = [];

                // 页面重新
                window.location.reload();

                return res;
            } catch (e) {
                console.log(e);
            }
        };

        // 获取用户信息
        const getUserInfo = async () => {
            try {
                const res = await userInfoApi();
                userInfo.value = res.data.userInfo;
                menuList.value = res.data.menuList;
                buttonList.value = res.data.buttonList;

                await filterRouter();
                return res;
            } catch (e) {
                console.log(e);
            }
        };

        // 过滤出当前所拥有的路由数据
        const filterRouter = () => {
            // 1. 处理加载的组件的key值
            const viewsModules = parseRouteKey();
            // 2. 将菜单的数据component的值变成 懒加载的组件
            const newRouter = dynamicImportComponent(menuList.value, viewsModules);
            // // 3. 动态添加路由
            addRouterHandle(newRouter);
        };

        //   // 将菜单数据的componet的值转化为 路由懒加载
        //   const addRouterHandle = (newRouter) => {
        //       dynamicRoutes[0].children = [...(newRouter || [])];
        //       dynamicRoutes.forEach((route) => {
        //           router.addRoute(route);
        //       });
        //       // 4. 调用获取缓存组件名称方法
        //       filterCacheName(dynamicRoutes[0]);
        //   };

        //   // 将后台返回的component转化为动态导入路由组件 component : '/home/index.vue' => conmponent = () => import()
        //   const dynamicImportComponent = (menuList, viewsModules) => {
        //       if (menuList.length <= 0) return [];

        //       menuList.map((item) => {
        //           const { component } = item;
        //           if (component) {
        //               item.component = viewsModules[`${component}`] || viewsModules[`/${component}`];
        //           }
        //           item.children && dynamicImportComponent(item.children, viewsModules);
        //           return item;
        //       });

        //       return menuList;
        //   };

        //   // 处理导入组件的key值 . 将 src/views去掉
        //   const parseRouteKey = () => {
        //       const modules = import.meta.glob(["@/views/**/*.vue", "!@/views/**/components/**"]);
        //       const viewsModules = Object.keys(modules).reduce(
        //           (prevObj, currentKey) =>
        //               Object.assign(prevObj, {
        //                   [currentKey.replace(/\/src\/views|..\/views/, "")]: modules[currentKey],
        //               }),
        //           {}
        //       );
        //       return viewsModules;
        //   };

        //   // 获取需要缓存组件的name名称
        //   const filterCacheName = (routes) => {
        //       const deepCacheName = (routes) => {
        //           console.log("routes====>", routes);
        //           if (routes.meta?.cache && routes.name) {
        //               cacheName.value.push(routes.name);
        //               console.log(" cacheName.value", cacheName.value);
        //           }
        //           if (routes.children && routes.children.length > 0) {
        //               routes.children.forEach((item) => {
        //                   deepCacheName(item);
        //               });
        //           }
        //       };
        //       deepCacheName(routes);
        //   };

        return {
            accessToken,
            userInfo,
            menuList,
            buttonList,
            login,
            getUserInfo,
            filterRouter,
            cacheName,
            logout,
        };
    },
    {
        // 开启数据持久化
        persist: {
            paths: ["accessToken"],
        },
    }
);
