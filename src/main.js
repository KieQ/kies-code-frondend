import { createApp } from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import {createRouter, createWebHistory} from "vue-router"



import VideoList from './components/video/VideoList.vue'
import VideoDetail from './components/video/VideoDetail.vue'
import HomePage from './components/HomePage.vue'
import NotFound from './components/NotFound.vue'


const routes = createRouter({
    history: createWebHistory(),
    routes:[
        {path: '/:pathMatch(.*)*', component: NotFound},
        {path: '/', component: HomePage},
        {path: '/video/list', component:VideoList},
        {path: '/video/detail', component:VideoDetail}
    ]
})

createApp(App).use(routes).mount('#app')
