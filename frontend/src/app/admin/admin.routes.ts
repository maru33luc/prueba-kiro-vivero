import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'plants',
    loadComponent: () =>
      import('./admin-plant-form/admin-plant-form.component').then(
        (m) => m.AdminPlantFormComponent,
      ),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./admin-category/admin-category.component').then(
        (m) => m.AdminCategoryComponent,
      ),
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./admin-order-list/admin-order-list.component').then(
        (m) => m.AdminOrderListComponent,
      ),
  },
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full',
  },
];
