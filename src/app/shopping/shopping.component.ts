import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { TopbarWidget } from './components/topbar.widget';
import { FooterWidget } from './components/footer.widget';

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    TopbarWidget,
    FooterWidget,
    RippleModule,
    StyleClassModule
  ],
  template: `
    <div class="bg-surface-0 dark:bg-surface-900">
      <div id="home" class="shopping-wrapper overflow-hidden">
        <app-topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" />
        <router-outlet></router-outlet>
        <app-footer-widget />
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .shopping-wrapper {
      min-height: 100vh;
    }
  `]
})
export class ShoppingComponent {}
