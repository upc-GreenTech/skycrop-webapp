
import {createRouter, createWebHistory} from 'vue-router';

const pendingSection = () => import('./shared/presentation/views/pending-section.vue');

const routes = [
  {path: '/', redirect: '/plots'},
  {path: '/home', name: 'home', component: pendingSection, props: {titleKey: 'navigation.home'}},
  {path: '/profiles', name: 'profile', component: pendingSection, props: {titleKey: 'navigation.profile'}},
  {path: '/drones', name: 'drones', component: pendingSection, props: {titleKey: 'navigation.drones'}},
  {path: '/diagnoses', name: 'diagnoses', component: pendingSection, props: {titleKey: 'navigation.diagnoses'}},
  {path: '/reports', name: 'reports', component: pendingSection, props: {titleKey: 'navigation.reports'}},
  {path: '/settings', name: 'settings', component: pendingSection, props: {titleKey: 'navigation.settings'}},

  {path: '/plots', name: 'plots', component: () => import('./plots/presentation/views/plot-list.vue')},
  {path: '/plots/new', name: 'plot-registration', component: () => import('./plots/presentation/views/plot-registration.vue')},
  {path: '/plots/:id', name: 'plot-details', component: () => import('./plots/presentation/views/plot-details.vue')},

  {path: '/plots/:id/crops/new', name: 'crop-registration', component: () => import('./field-management/presentation/components/crop-form.vue')},
  {path: '/plots/:id/crops', name: 'crop-list', component: () => import('./field-management/presentation/views/crop-list.vue')},
  {path: '/plots/:id/crops/:cropId/edit', name: 'crop-edit', component: () => import('./field-management/presentation/components/crop-form.vue')},
  {path: '/plots/:id/crops/:cropId', name: 'crop-details', component: () => import('./field-management/presentation/views/crop-details.vue')}
];

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});
