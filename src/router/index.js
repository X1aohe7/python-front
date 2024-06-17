import {createRouter, createWebHashHistory} from 'vue-router';
import Login from "../views/Login.vue";
import BusinessManage from "../views/BusinessManage.vue";
import BusinessOrders from "../components/business/BusinessOrders.vue";
import BusinessOrderDetail from "../components/business/BusinessOrderDetail.vue";
import ItemList from "../components/business/ItemList.vue";
import CustomerManage from "../views/CustomerManage.vue";
import BusinessList from "../components/customer/BusinessList.vue";
import CustomerOrders from "../components/customer/CustomerOrders.vue";
import BusinessInfo from "../components/customer/BusinessInfo.vue";
import CustomerOrderDetail from "../components/customer/CustomerOrderDetail.vue";
import CustomerInfo from "../components/customer/CustomerInfo.vue";
import CustomerEditPassword from "../components/customer/CustomerEditPassword.vue";
import BusinessEditPassword from "../components/business/BusinessEditPassword.vue";
import EditBusinessInfo from "../components/business/EditBusinessInfo.vue";
import AiTalk from "../components/AiTalk.vue";
import ItemInfo from "../components/customer/ItemInfo.vue";
import customerRegister from "../views/customerRegister.vue";
import businessRegister from "../views/businessRegister.vue";

const routes = [
    {
        path: "/",
        redirect:"/business"
    },
    {
        path:'/login',
        component:Login
    },
    {
        path:'/customerRegister',
        component:customerRegister
    },
    {
        path:'/businessRegister',
        component:businessRegister
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
            },
            {
                path: "editBusinessInfo",
                name:"修改商家信息",
                component: EditBusinessInfo
            },
            {
                path: "businessEditPassword",
                name:"修改商家密码",
                component: BusinessEditPassword
            },
            {
                path: "AiTalk",
                name:"Ai对话",
                component: AiTalk
            }
        ]
    },
    {
        path: "/customer",
        name: "顾客界面",
        component: CustomerManage,
        children:[
            {
                path: "businessList",
                name: "店铺列表",
                component: BusinessList
            },
            {
                path: "customerOrders",
                name: "我的订单",
                component: CustomerOrders
            },
            {
                path: "businessInfo",
                name: "商户信息",
                component: BusinessInfo
            },
            {
                path: "orderDetail",
                name:"订单明细",
                component: CustomerOrderDetail
            },
            {
                path: "customerInfo",
                name:"顾客信息",
                component: CustomerInfo
            },
            {
                path: "editPassword",
                name:"修改密码",
                component: CustomerEditPassword
            },
            {
                path: "AiTalk",
                name:"Ai咨询",
                component: AiTalk
            },
            {
                path: 'ItemInfo',
                name: '商品信息',
                component: ItemInfo
            }
            // {
            //     path: "ItemInfo",
            //     name: "商品信息",
            //     component: ItemInfo
            // }
            // {
            //     path: "confirm",
            //     name:"确认订单",
            //     component: Confirm
            // }
        ]
    },
]


const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {


    /***************检测是否有token，若无则返回登录页*****************/
    const user = sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : null
    const isLogin = !!user
    // //放行登录页和注册页
    // if (to.path === '/login' ) {
    //     next()
    // }else  {
    //     isLogin ? next() : next('/login')
    // }
    // Allow access to login page and registration page
    if (to.path === '/login' || to.path === '/customerRegister' || to.path === '/businessRegister') {
        next();
    } else {
        // If user is not logged in, redirect to login page
        if (!isLogin) {
            next('/login');
        } else {
            // Check user type and route accordingly
            const userType = user.userType;
            console.log(userType)
            if (to.path.startsWith('/customer') && userType === 0) {
                // User is a customer, allow access to customer routes
                next();
            } else if (to.path.startsWith('/business') && userType === 1) {
                // User is a merchant, allow access to merchant routes
                next();
            } else {
                // User is trying to access the opposite type of route, redirect to appropriate page
                if (userType === 0) {
                    next('/business/businessList');
                } else if (userType === 1) {
                    next('/customer/shopList');
                }
            }
        }
    }
})
export default router