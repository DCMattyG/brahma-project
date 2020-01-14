import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataBalloonDirective } from './app-tooltip.directive';
import { TopologyComponent } from './topology/topology.component';
import { SwitchesComponent } from './switches/switches.component';
import { VlanManageComponent } from './vlans/vlan-manage/vlan-manage.component';
import { VlanUsageComponent } from './vlans/vlan-usage/vlan-usage.component';
import { WizardComponent } from './wizard/wizard.component';
import { WizardOOBMgmtComponent } from './wizard/steps/oob-mgmt/wizard-oob-mgmt.component';
import { WizardIBMgmtComponent } from './wizard/steps/ib-mgmt/wizard-ib-mgmt.component';
import { WizardDNSConfigComponent } from './wizard/steps/dns-config/wizard-dns-config.component';
import { WizardNTPConfigComponent } from './wizard/steps/ntp-config/wizard-ntp-config.component';
import { WizardCardTestAComponent } from './wizard/steps/card-testa/wizard-card-testa.component';
import { WizardCardTestBComponent } from './wizard/steps/card-testb/wizard-card-testb.component';
import { GlobalConfigComponent } from './global/global-config.component';
import { WizardWrapperComponent } from './wizard-new/wizard-wrapper.component';
import { DataGuageDirective } from './app-guage.directive';
import { WizardPanelTestAComponent } from './wizard/steps/panel-testa/wizard-panel-testa.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DataBalloonDirective,
    TopologyComponent,
    SwitchesComponent,
    VlanManageComponent,
    VlanUsageComponent,
    WizardComponent,
    WizardOOBMgmtComponent,
    WizardIBMgmtComponent,
    WizardDNSConfigComponent,
    WizardNTPConfigComponent,
    WizardCardTestAComponent,
    WizardCardTestBComponent,
    WizardPanelTestAComponent,
    GlobalConfigComponent,
    WizardWrapperComponent,
    DataGuageDirective
  ],
  entryComponents: [
    GlobalConfigComponent,
    WizardOOBMgmtComponent,
    WizardIBMgmtComponent,
    WizardNTPConfigComponent,
    VlanManageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
