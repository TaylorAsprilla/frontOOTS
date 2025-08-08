import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatGroupComponent } from './chat-group/chat-group.component';
import { StatisticsCardComponent } from './statistics-card/statistics-card.component';
import { StatisticsCard2Component } from './statistics-card2/statistics-card2.component';
import { StatisticsCard3Component } from './statistics-card3/statistics-card3.component';
import { UserCardComponent } from './user-card/user-card.component';
import { TodoComponent } from './todo/todo.component';
import { InboxComponent } from './inbox/inbox.component';
import { ChartStatisticsComponent } from './chart-statistics/chart-statistics.component';
import { CountUpModule } from 'ngx-countup';
import { ChatComponent } from './chat/chat.component';
import { PricingCardsComponent } from './pricing-cards/pricing-cards.component';
import { PreloaderComponent } from './preloader/preloader.component';
import { FaqComponent } from './faq/faq.component';
import { NgbDropdownModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SimplebarAngularModule } from 'simplebar-angular';
import { FormsModule } from '@angular/forms';
import { StatisticsWidgetComponent } from './statistics-widget/statistics-widget.component';
import { StatisticsCard4Component } from './statistics-card4/statistics-card4.component';
import { ChartCardComponent } from './chart-card/chart-card.component';
import { RoundedProgressChartComponent } from './rounded-progress-chart/rounded-progress-chart.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { VectormapComponent } from './vectormap/vectormap.component';
import { CanadaMapComponent } from './vectormap/canada-map/canada-map.component';
import { WorldMapComponent } from './vectormap/world-map/world-map.component';
import { UsaMapComponent } from './vectormap/usa-map/usa-map.component';
import { IraqMapComponent } from './vectormap/iraq-map/iraq-map.component';
import { ItalyMapComponent } from './vectormap/italy-map/italy-map.component';
import { RussiaMapComponent } from './vectormap/russia-map/russia-map.component';
import { SpainMapComponent } from './vectormap/spain-map/spain-map.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ChatGroupComponent,
    StatisticsCardComponent,
    StatisticsCard2Component,
    StatisticsCard3Component,
    UserCardComponent,
    ChatComponent,
    TodoComponent,
    InboxComponent,
    ChartStatisticsComponent,
    PricingCardsComponent,
    PreloaderComponent,
    FaqComponent,
    StatisticsWidgetComponent,
    StatisticsCard4Component,
    ChartCardComponent,
    RoundedProgressChartComponent,
    VectormapComponent,
    CanadaMapComponent,
    WorldMapComponent,
    UsaMapComponent,
    IraqMapComponent,
    ItalyMapComponent,
    RussiaMapComponent,
    SpainMapComponent
  ],
  imports: [
    CommonModule,
    // RouterModule,
    FormsModule,
    SimplebarAngularModule,
    NgApexchartsModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    CountUpModule
  ],
  exports: [
    ChatGroupComponent,
    StatisticsCardComponent,
    StatisticsCard2Component,
    StatisticsCard3Component,
    UserCardComponent,
    ChatComponent,
    TodoComponent,
    InboxComponent,
    ChartStatisticsComponent,
    PricingCardsComponent,
    PreloaderComponent,
    FaqComponent,
    StatisticsWidgetComponent,
    StatisticsCard4Component,
    ChartCardComponent,
    RoundedProgressChartComponent,
    VectormapComponent,
    CanadaMapComponent,
    WorldMapComponent,
    UsaMapComponent,
    IraqMapComponent,
    ItalyMapComponent,
    RussiaMapComponent,
    SpainMapComponent
  ]
})
export class WidgetModule { }
