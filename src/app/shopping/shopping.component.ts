import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { TopbarWidget } from './components/topbar.widget';

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    TopbarWidget,
    RippleModule,
    StyleClassModule
  ],
  template: `
    <div class="bg-surface-0 dark:bg-surface-900 min-h-screen">
      <div id="home" class="shopping-wrapper">
        <app-topbar-widget />
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ShoppingComponent {}
