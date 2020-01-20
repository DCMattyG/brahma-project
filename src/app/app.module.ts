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
import { VlanManageComponent } from './config/components/vlans/vlan-manage/vlan-manage.component';
import { VlanUsageComponent } from './config/components/vlans/vlan-usage/vlan-usage.component';
import { WizardComponent } from './config/wizard/wizard.component';
import { WizardOOBMgmtComponent } from './config/components/oob-mgmt/wizard-oob-mgmt.component';
import { WizardIBMgmtComponent } from './config/components/ib-mgmt/wizard-ib-mgmt.component';
import { WizardDNSConfigComponent } from './config/components/dns-config/wizard-dns-config.component';
import { WizardNTPConfigComponent } from './config/components/ntp-config/wizard-ntp-config.component';
import { WizardCardTestAComponent } from './testing/card-testa/wizard-card-testa.component';
import { WizardCardTestBComponent } from './testing/card-testb/wizard-card-testb.component';
import { GlobalConfigComponent } from './config/components/global/global-config.component';
import { DataGuageDirective } from './app-guage.directive';
import { WizardPanelTestAComponent } from './testing/panel-testa/wizard-panel-testa.component';
import { WizardPanelTestBComponent } from './testing/panel-testb/wizard-panel-testb.component';
import { WizardPanelTestCComponent } from './testing/panel-testc/wizard-panel-testc.component';
import { TemplateComponent } from './config/template/template.component';
import { OnePanelComponent } from './testing/one-panel/one-panel.component';
import { ThreePanelComponent } from './testing/three-panel/three-panel.component';
import { FourPanelComponent } from './testing/four-panel/four-panel.component';
import { TwoPanelHComponent } from './testing/two-panel-h/two-panel-h.component';
import { TwoPanelVComponent } from './testing/two-panel-v/two-panel-v.component';

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
    WizardPanelTestBComponent,
    WizardPanelTestCComponent,
    GlobalConfigComponent,
    DataGuageDirective,
    TemplateComponent,
    OnePanelComponent,
    ThreePanelComponent,
    FourPanelComponent,
    TwoPanelHComponent,
    TwoPanelVComponent
  ],
  entryComponents: [
    GlobalConfigComponent,
    WizardOOBMgmtComponent,
    WizardIBMgmtComponent,
    WizardNTPConfigComponent,
    VlanManageComponent,
    OnePanelComponent,
    ThreePanelComponent,
    FourPanelComponent,
    TwoPanelHComponent,
    TwoPanelVComponent
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
