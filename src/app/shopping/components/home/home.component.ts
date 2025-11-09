import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { HeroWidget } from '../hero.widget';
import { FeaturesWidget } from '../features.widget';
import { HighlightsWidget } from '../highlights.widget';
import { PricingWidget } from '../pricing.widget';

@Component({
  selector: 'app-shopping-home',
  standalone: true,
  imports: [
    SharedModule,
    HeroWidget,
    FeaturesWidget,
    HighlightsWidget,
    PricingWidget
  ],
  template: `
    <app-hero-widget />
    <app-features-widget />
    <app-highlights-widget />
    <app-pricing-widget />
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ShoppingHomeComponent {}
