// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss'],
//   standalone: false
// })
// export class AppComponent {
//   title = 'erp-fe-sakai';
// }

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule],
    template: `
        <p-toast />
        <router-outlet></router-outlet>
    `
})
export class AppComponent {}
