import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import MapView from '@/components/Map.vue'
import NewImageView from '@/components/NewImage.vue'


const routes: Array<RouteRecordRaw> = [
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
        
    

]
const router = createRouter({
    routes,
    history: createWebHistory()
})

export default router
