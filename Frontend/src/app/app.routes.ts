import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './shared/components/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      // CORE
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'profile',   loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent) },

      // FARMER section — layout with tabs + child routes
      {
        path: 'farmer',
        canActivate: [roleGuard],
        data: { roles: ['ROLE_FARMER', 'FARMER', 'ROLE_ADMIN', 'ADMIN'] },
        loadComponent: () => import('./features/farmer/farmer-layout.component').then(m => m.FarmerLayoutComponent),
        children: [
          { path: 'add',  loadComponent: () => import('./features/farmer/farmer-form/farmer-form.component').then(m => m.FarmerFormComponent) },
          { path: 'list', loadComponent: () => import('./features/farmer/farmer-list/farmer-list.component').then(m => m.FarmerListComponent) },
          // Legacy
          { path: 'crops',    loadComponent: () => import('./features/farmer/view-crops/view-crops.component').then(m => m.ViewCropsComponent) },
          { path: 'add-crop', loadComponent: () => import('./features/farmer/add-crop/add-crop.component').then(m => m.AddCropComponent) },
          { path: '', redirectTo: 'add', pathMatch: 'full' }
        ]
      },

      // CROP section — layout with tabs + child routes
      {
        path: 'crop',
        canActivate: [roleGuard],
        data: { roles: ['ROLE_FARMER', 'FARMER', 'ROLE_DEALER', 'DEALER', 'ROLE_ADMIN', 'ADMIN'] },
        loadComponent: () => import('./features/crop/crop-layout.component').then(m => m.CropLayoutComponent),
        children: [
          { 
            path: 'add', 
            canActivate: [roleGuard],
            data: { roles: ['ROLE_FARMER', 'FARMER'] },
            loadComponent: () => import('./features/crop/add-crop/add-crop.component').then(m => m.CropAddComponent) 
          },
          { path: 'list',         loadComponent: () => import('./features/crop/view-crops/view-crops.component').then(m => m.CropViewComponent) },
          { 
            path: 'subscription', 
            canActivate: [roleGuard],
            data: { roles: ['ROLE_DEALER', 'DEALER'] },
            loadComponent: () => import('./features/crop/subscription/subscription.component').then(m => m.SubscriptionComponent) 
          },
          { path: '', redirectTo: 'add', pathMatch: 'full' }
        ]
      },

      // DEALER
      { 
        path: 'dealer/buy', 
        canActivate: [roleGuard],
        data: { roles: ['ROLE_DEALER', 'DEALER'] },
        loadComponent: () => import('./features/dealer/buy-crop/buy-crop.component').then(m => m.DealerBuyComponent) 
      },
      { 
        path: 'dealer/crops', 
        canActivate: [roleGuard],
        data: { roles: ['ROLE_DEALER', 'DEALER'] },
        loadComponent: () => import('./features/dealer/browse-crops/browse-crops.component').then(m => m.BrowseCropsComponent) 
      },

      // ORDERS section — layout with tabs + child routes
      {
        path: 'orders',
        canActivate: [roleGuard],
        data: { roles: ['ROLE_DEALER', 'DEALER'] },
        loadComponent: () => import('./features/orders/orders-layout.component').then(m => m.OrdersLayoutComponent),
        children: [
          { path: 'create',  loadComponent: () => import('./features/orders/order-create/order-create.component').then(m => m.OrderCreateComponent) },
          { path: 'history', loadComponent: () => import('./features/orders/order-history/order-history.component').then(m => m.OrderHistoryComponent) },
          { path: 'invoice', loadComponent: () => import('./features/orders/invoice-view/invoice-view.component').then(m => m.InvoiceViewComponent) },
          { path: '',        redirectTo: 'create', pathMatch: 'full' }
        ]
      },

      // ADMIN
      { 
        path: 'admin/farmers', 
        canActivate: [roleGuard],
        data: { roles: ['ROLE_ADMIN', 'ADMIN'] },
        loadComponent: () => import('./features/admin/admin-farmers/admin-farmers.component').then(m => m.AdminFarmersComponent) 
      },
      { 
        path: 'admin/dealers', 
        canActivate: [roleGuard],
        data: { roles: ['ROLE_ADMIN', 'ADMIN'] },
        loadComponent: () => import('./features/admin/admin-dealers/admin-dealers.component').then(m => m.AdminDealersComponent) 
      },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'auth/login' }
];