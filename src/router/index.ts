import { createRouter, createWebHashHistory } from 'vue-router'
import Act1 from '../game/data/chapters/act1.vue'
import Act2 from '../game/data/chapters/act2.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Act1',
      component: Act1
    },
    {
      path: '/act-:hash',
      name: 'Act2',
      component: Act2,
      beforeEnter: (to, from, next) => {
        // 简单验证：必须从第一幕跳转过来
        if (from.name === 'Act1') {
          next()
        } else {
          // 尝试直接访问则重定向回第一幕
          next('/')
        }
      }
    }
  ]
})

export default router
