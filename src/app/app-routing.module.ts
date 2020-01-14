import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { TopologyComponent } from './topology/topology.component';
import { SwitchesComponent } from './switches/switches.component';
import { VlanManageComponent } from './vlans/vlan-manage/vlan-manage.component';
import { VlanUsageComponent } from './vlans/vlan-usage/vlan-usage.component';
import { WizardComponent } from './wizard/wizard.component';
import { GlobalConfigComponent } from './global/global-config.component';
import { WizardWrapperComponent } from './wizard-new/wizard-wrapper.component';
import { WizardCardTestAComponent } from './wizard/steps/card-testa/wizard-card-testa.component';
import { WizardCardTestBComponent } from './wizard/steps/card-testb/wizard-card-testb.component';
import { WizardPanelTestAComponent } from './wizard/steps/panel-testa/wizard-panel-testa.component';

const routes: Routes = [
  {
    path: '',
    component: SwitchesComponent,
    pathMatch: 'full'
  },
  // {
  //   path: 'home',
  //   component: HomeComponent,
  //   pathMatch: 'full',
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'topology',
    component: TopologyComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'global',
    component: GlobalConfigComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'switches',
    component: SwitchesComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'vlan/manage',
    component: VlanManageComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'vlan/usage',
    component: VlanUsageComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'wizard',
    component: WizardWrapperComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'test',
    component: WizardPanelTestAComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  // { 
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full'
  // },
  { 
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
