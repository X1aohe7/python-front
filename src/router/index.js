import {createRouter, createWebHashHistory} from 'vue-router';
import Login from "../views/Login.vue";
import BusinessManage from "../views/BusinessManage.vue";
import BusinessOrders from "../components/business/BusinessOrders.vue";
import BusinessOrderDetail from "../components/business/BusinessOrderDetail.vue";
import ItemList from "../components/business/ItemList.vue";

const routes = [
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
export default router