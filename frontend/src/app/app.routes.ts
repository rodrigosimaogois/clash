import { Routes } from '@angular/router';
import { WarDetailsComponent } from './pages/war-details/war-details.component';
import { TokenConfigComponent } from './pages/token-config/token-config.component';

export const routes: Routes = [

  { path: '', redirectTo: 'war-details', pathMatch: 'full' },
  { path: 'war-details', component: WarDetailsComponent },
  { path: 'config', component: TokenConfigComponent },
];
