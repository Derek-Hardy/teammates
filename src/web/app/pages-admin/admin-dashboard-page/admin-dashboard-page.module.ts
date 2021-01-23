import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardPageComponent } from './admin-dashboard-page.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardPageComponent,
  },
];

/**
 * Module for admin dashboard page.
 */
@NgModule({
  declarations: [
    AdminDashboardPageComponent,
  ],
  exports: [
    AdminDashboardPageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
})
export class AdminDashboardPageModule { }
