import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent implements OnInit {
  private router = inject(Router);

  ngOnInit(): void {
    // Opcional: limpiar el carrito si llegamos aquí
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToOrders() {
    this.router.navigate(['/my-orders']);
  }
}
