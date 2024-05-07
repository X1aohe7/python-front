import {createRouter, createWebHashHistory} from 'vue-router';
import Login from "../views/Login.vue";
import BusinessManage from "../views/BusinessManage.vue";
import BusinessOrders from "../components/business/BusinessOrders.vue";
import BusinessOrderDetail from "../components/business/BusinessOrderDetail.vue";
import ItemList from "../components/business/ItemList.vue";

const routes = [
    {
        path: "/",
        redirect:"/business"
    },
    {
        path: "/customer",
        redirect: "/customer/shopList"
    },
    {
        path:'/login',
        component:Login
    },
    {
        path: "/business",
        name: "商家界面",
        component: BusinessManage,
        children: [

            {
                path: "itemList",
                name: "商品列表",
                component: ItemList
            },
            {
                path: "businessOrders",
                name: "订单列表",
                component: BusinessOrders
            },

            {
                path: "orderDetail",
                name: "订单信息",
                component: BusinessOrderDetail
            }
        ]
    }
]


const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

// router.beforeEach((to, from, next) => {
//
//
//     /***************检测是否有token，若无则返回登录页*****************/
//     const user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user"))[0] : null
//     const isLogin = !!user
//     // //放行登录页和注册页
//     // if (to.path === '/login' ) {
//     //     next()
//     // }else  {
//     //     isLogin ? next() : next('/login')
//     // }
//     // Allow access to login page and registration page
//     if (to.path === '/login') {
//         next();
//     } else {
//         // If user is not logged in, redirect to login page
//         if (!isLogin) {
//             next('/login');
//         } else {
//             // Check user type and route accordingly
//             const userType = user.userType;
//             console.log(userType)
//             if (to.path.startsWith('/customer') && userType === 0) {
//                 // User is a customer, allow access to customer routes
//                 next();
//             } else if (to.path.startsWith('/business') && userType === 1) {
//                 // User is a merchant, allow access to merchant routes
//                 next();
//             } else {
//                 // User is trying to access the opposite type of route, redirect to appropriate page
//                 if (userType === 0) {
//                     next('/business/businessList');
//                 } else if (userType === 1) {
//                     next('/customer/shopList');
//                 }
//             }
//         }
//     }
// })
export default router