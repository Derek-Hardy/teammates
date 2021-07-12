import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingSpinnerModule } from '../../components/loading-spinner/loading-spinner.module';
import { PanelChevronModule } from '../../components/panel-chevron/panel-chevron.module';
import { AdminDashboardPageComponent } from './admin-dashboard-page.component';
import { SessionDashboardComponent } from './session-dashboard/session-dashboard.component';

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
    SessionDashboardComponent,
  ],
  exports: [
    AdminDashboardPageComponent,
    SessionDashboardComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    RouterModule.forChild(routes),
    LoadingSpinnerModule,
    PanelChevronModule,
  ],
})
export class AdminDashboardPageModule { }
