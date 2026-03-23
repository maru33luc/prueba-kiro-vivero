import { Routes } from '@angular/router';

export const CATALOG_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./plant-list/plant-list.component').then(
        (m) => m.PlantListComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./plant-detail/plant-detail.component').then(
        (m) => m.PlantDetailComponent,
      ),
  },
];
