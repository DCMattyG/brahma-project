import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { TopologyComponent } from './topology/topology.component';
import { SwitchesComponent } from './switches/switches.component';
import { VlanManageComponent } from './config/components/vlans/vlan-manage/vlan-manage.component';
import { VlanUsageComponent } from './config/components/vlans/vlan-usage/vlan-usage.component';
import { WizardComponent } from './config/wizard/wizard.component';
import { GlobalConfigComponent } from './config/components/global/global-config.component';
import { WizardCardTestAComponent } from './testing/card-testa/wizard-card-testa.component';
import { WizardCardTestBComponent } from './testing/card-testb/wizard-card-testb.component';
import { WizardPanelTestAComponent } from './testing/panel-testa/wizard-panel-testa.component';
import { WizardPanelTestBComponent } from './testing/panel-testb/wizard-panel-testb.component';
import { WizardPanelTestCComponent } from './testing/panel-testc/wizard-panel-testc.component';
import { TemplateComponent } from './config/template/template.component';

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
    component: WizardComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'testa',
    component: WizardPanelTestAComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'testb',
    component: WizardPanelTestBComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'testc',
    component: WizardPanelTestCComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  {
    path: 'template',
    component: TemplateComponent,
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
