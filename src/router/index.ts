import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: "/", name: 'Home', component: () => import('@/views/Home.vue'), },
  { path: "/how-it-works", name: 'Questions', component: () => import('@/views/Questions.vue'), },
  { path: "/validators", name: 'Validators', component: () => import('@/views/Validators.vue'), },
  { path: "/validators/:address", name: 'Validator', component: () => import('@/views/ValidatorDetail.vue'), },
  { path: "/portfolio", name: 'Portfolio', component: () => import('@/views/Portfolio.vue'), },
];

const router = createRouter({
  scrollBehavior() {
    return { left: 0, top: 0, behavior: 'smooth' };
  },
  history: createWebHistory(),
  routes,
});

export default router;
