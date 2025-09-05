import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Pocetna',
    component: () => import('@/components/Pocetna.vue'),
  },
  {
    path: '/proizvodi',
    name: 'Proizvodi',
    component: () => import('@/pages/Proizvodi.vue'),
  },
  {
    path: '/dodaj-proizvod',
    name: 'DodajProizvod',
    component: () => import('@/pages/DodajProizvod.vue'),
  },
  {
    path: '/proizvodi/:id',
    name: 'ProizvodiDetalji',
    component: () => import('@/pages/ProizvodiDetalji.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router