import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Homepage from '@/components/Homepage.vue';
import NewImageView from '@/components/NewImage.vue'
import SegmentEdit from '@/components/SegmentEdit.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "home",
        component: Homepage,
    },
    {
        path: "/newImage",
        name: "newImage",
        component: NewImageView,
    },
    {
        path: "/edit",
        name: "edit",
        component: SegmentEdit,
    },

]
const router = createRouter({
    routes,
    history: createWebHistory('/coralscop')
})

export default router
