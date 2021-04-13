import Vue from 'vue'
import VueRouter from 'vue-router'

import Splash from '../views/Splash.vue'
import Todos from '../views/Todos.vue'
import Todo from '../views/Todo.vue'
import NotFound from '../views/NotFound.vue'
import TodosCat from '../views/TodosCat.vue'

Vue.use(VueRouter)

export default new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'splash',
            component: Splash
        },
        {
            path: '/todos',
            name: 'todos',
            component: Todos,
        },
        {
            path: '/todos/:category',
            name: 'TodosCat',
            component: TodosCat,
        },
        {
            path: '/done',
            name: 'Done',
            component: Todos,
            props: {
                done: true,
            }
        },
        {
            path: '/done/:category',
            name: 'DoneCat',
            component: TodosCat,
            props: {
                done: true
            }
        },
        {
            path: '/todo/:id',
            name: 'Todo',
            component: Todo,
        },
        {
            path: '/404',
            name: '404',
            component: NotFound,
        },
        {
            path: '*',
            redirect: '/404',
        },
    ]
})