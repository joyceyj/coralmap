import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Homepage from '@/components/Homepage.vue';
import MapView from '@/components/Map.vue'
import NewImageView from '@/components/NewImage.vue'
import LoginView from '@/components/Login.vue'


const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "home",
        component: Homepage,
    },
    {
        path: "/map",
        name: "map",
        component: MapView,
    },
    {
        path: "/newImage",
        name: "newImage",
        component: NewImageView,
    },
    {
        path: "/login",
        name: "login",
        component: LoginView,
    },
    

]
const router = createRouter({
    routes,
    history: createWebHistory('/coralscop')
})

export default router
