import Vue from 'vue'
import VueRouter from 'vue-router'
import About from '../views/About'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: About
  },
  {
    path: '/About',
    name: 'About',
    component: About
  },
  {
    path: '/Markdown/:id?',
    name: 'Markdown',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Markdown/_id.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
