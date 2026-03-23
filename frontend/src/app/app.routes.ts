import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './pages/home.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'catalog',
        loadChildren: () =>
          import('./catalog/catalog.routes').then((m) => m.CATALOG_ROUTES),
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('./cart/cart.routes').then((m) => m.CART_ROUTES),
      },
      {
        path: 'checkout',
        loadChildren: () =>
          import('./checkout/checkout.routes').then((m) => m.CHECKOUT_ROUTES),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('./orders/orders.routes').then((m) => m.ORDERS_ROUTES),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
