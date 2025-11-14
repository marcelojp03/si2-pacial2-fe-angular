import { Component, inject, OnInit, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription, interval } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { SharedModule } from '../../../shared/shared.module';
import { CartStore } from '../../../core/state/cart.store';
import { AuthService } from '../../../core/services/auth.service';
import { AddressService } from '../../../core/services/address.service';
import { CheckoutService } from '../../../core/services/checkout.service';
import type { Address, CreateAddressRequest } from '../../../core/models/address.model';
import { 
  PAYMENT_METHOD_LABELS, 
  PAYMENT_PROVIDER_LABELS, 
  type PaymentMethod, 
  type PaymentProvider 
} from '../../../core/models/checkout.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  providers: [MessageService],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  router = inject(Router); // Made public for template access
  private messageService = inject(MessageService);
  private cartStore = inject(CartStore);
  private authService = inject(AuthService);
  private addressService = inject(AddressService);
  private checkoutService = inject(CheckoutService);

  loading = signal(false);
  processing = signal(false);
  addresses = signal<Address[]>([]);
  selectedAddressId = signal<number | null>(null);
  selectedPaymentMethod = signal<PaymentMethod>('CASH');
  selectedPaymentProvider = signal<PaymentProvider | null>(null);

  // VPAY QR
  showQRModal = signal(false);
  qrImage = signal<string | null>(null);
  orderId = signal<number | null>(null);
  orderNumber = signal<string>('');
  pollingSubscription: Subscription | null = null;
  timerSubscription: Subscription | null = null; // Suscripción del temporizador
  pollingAttempts = signal(0);
  maxPollingAttempts = 100; // 5 minutos (100 * 3s)
  remainingSeconds = signal(300); // 5 minutos en segundos
  timerDisplay = computed(() => {
    const seconds = this.remainingSeconds();
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  });

  showNewAddressForm = false;
  selectedAddressIdModel: number | null = null;
  selectedPaymentMethodModel: PaymentMethod = 'CASH';

  cartItems = this.cartStore.items;
  subtotal = this.cartStore.totalAmount;
  tax = signal(0); // Impuesto (debe venir del backend)
  discount = signal(0); // Descuento aplicado (cupones, promociones)
  shippingCost = signal(0); // Costo de envío (debe venir del backend)
  total = computed(() => this.subtotal() + this.tax() + this.shippingCost() - this.discount());
  loadingTotals = signal(true); // Estado de carga de totales

  paymentMethods = [
    { value: 'CREDIT_CARD' as PaymentMethod, label: PAYMENT_METHOD_LABELS['CREDIT_CARD'], icon: 'pi pi-credit-card' },
    { value: 'DEBIT_CARD' as PaymentMethod, label: PAYMENT_METHOD_LABELS['DEBIT_CARD'], icon: 'pi pi-credit-card' },
    { value: 'CASH' as PaymentMethod, label: PAYMENT_METHOD_LABELS['CASH'], icon: 'pi pi-money-bill' },
    { value: 'BANK_TRANSFER' as PaymentMethod, label: PAYMENT_METHOD_LABELS['BANK_TRANSFER'], icon: 'pi pi-building-columns' },
    { value: 'QR' as PaymentMethod, label: PAYMENT_METHOD_LABELS['QR'], icon: 'pi pi-qrcode' }
  ];

  paymentProviders = [
    { value: 'VPAY' as PaymentProvider, label: PAYMENT_PROVIDER_LABELS['VPAY'], icon: 'pi pi-qrcode' },
    { value: 'STRIPE' as PaymentProvider, label: PAYMENT_PROVIDER_LABELS['STRIPE'], icon: 'pi pi-credit-card' },
    { value: 'PAYPAL' as PaymentProvider, label: PAYMENT_PROVIDER_LABELS['PAYPAL'], icon: 'pi pi-paypal' },
    { value: 'MOCK' as PaymentProvider, label: PAYMENT_PROVIDER_LABELS['MOCK'], icon: 'pi pi-wallet' }
  ];

  checkoutForm: FormGroup;

  constructor() {
    this.checkoutForm = this.fb.group({
      street: [''],
      city: [''],
      state: [''],
      country: ['Bolivia'],
      postal_code: [''],
      save_address: [false]
      // notes removed - backend Order model doesn't have this field
    });
  }

  ngOnInit(): void {
    this.loadAddresses();
    this.loadTotals(); // Cargar totales calculados desde el backend
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  loadTotals(): void {
    const cartId = this.cartStore.cartId();
    if (!cartId) {
      console.warn('[Checkout] No cartId found');
      this.loadingTotals.set(false);
      return;
    }

    this.loadingTotals.set(true);
    this.checkoutService.calculateTotals(cartId).subscribe({
      next: (response) => {
        console.log('[Checkout] Totals calculated:', response);
        this.tax.set(response.tax);
        this.shippingCost.set(response.shipping_cost);
        this.discount.set(response.discount);
        this.loadingTotals.set(false);
        // El total se calcula automáticamente con el computed()
      },
      error: (error) => {
        console.error('[Checkout] Error calculando totales:', error);
        this.loadingTotals.set(false);
        this.messageService.add({
          severity: 'warn',
          summary: 'Advertencia',
          detail: 'Error al calcular totales del carrito'
        });
      }
    });
  }

  loadAddresses(): void {
    const customerId = parseInt(localStorage.getItem('customer_id') || '0');
    if (!customerId) {
      console.warn('[Checkout] No customer_id found in localStorage');
      return;
    }

    this.loading.set(true);
    this.addressService.getAddresses(customerId).subscribe({
      next: (response: any) => {
        console.log('[Checkout] Addresses response:', response);
        // La API puede devolver un array directo o un objeto paginado {results: [...]}
        const addresses = Array.isArray(response) ? response : (response.results || []);
        this.addresses.set(addresses);
        
        if (addresses.length === 0) {
          // No hay direcciones guardadas, mostrar formulario de nueva dirección
          console.log('[Checkout] No saved addresses, showing new address form');
          this.showNewAddressForm = true;
        } else {
          const defaultAddr = addresses.find((a: Address) => a.is_default);
          if (defaultAddr) {
            this.selectAddress(defaultAddr.id);
          }
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('[Checkout] Error al cargar direcciones:', error);
        this.messageService.add({
          severity: 'warn',
          summary: 'Información',
          detail: 'No se encontraron direcciones guardadas'
        });
        this.loading.set(false);
      }
    });
  }

  selectAddress(addressId: number): void {
    this.selectedAddressId.set(addressId);
    this.selectedAddressIdModel = addressId;
    this.showNewAddressForm = false;
    this.checkoutForm.patchValue({
      street: '',
      city: '',
      state: '',
      postal_code: ''
    });
  }

  selectPaymentMethod(method: PaymentMethod): void {
    this.selectedPaymentMethod.set(method);
    this.selectedPaymentMethodModel = method;
    
    // Auto-seleccionar proveedor según el método
    if (method === 'QR') {
      // QR siempre usa VPAY
      this.selectedPaymentProvider.set('VPAY');
    } else if (method !== 'CREDIT_CARD' && method !== 'DEBIT_CARD') {
      // CASH, BANK_TRANSFER no necesitan proveedor específico
      this.selectedPaymentProvider.set(null);
    }
    // CREDIT_CARD y DEBIT_CARD mantienen el proveedor seleccionado manualmente
  }

  selectPaymentProvider(provider: PaymentProvider): void {
    this.selectedPaymentProvider.set(provider);
  }

  canProcessCheckout(): boolean {
    const hasAddress = this.selectedAddressId() !== null || 
      (this.showNewAddressForm && this.isNewAddressValid());
    const hasPaymentMethod = this.selectedPaymentMethod() !== null;
    const hasPaymentProvider = 
      (this.selectedPaymentMethod() === 'CREDIT_CARD' || this.selectedPaymentMethod() === 'DEBIT_CARD')
        ? this.selectedPaymentProvider() !== null
        : true;
    return hasAddress && hasPaymentMethod && hasPaymentProvider && !this.processing();
  }

  isNewAddressValid(): boolean {
    return !!(
      this.checkoutForm.get('street')?.value &&
      this.checkoutForm.get('city')?.value &&
      this.checkoutForm.get('country')?.value &&
      this.checkoutForm.get('postal_code')?.value
    );
  }

  async processCheckout(): Promise<void> {
    if (!this.canProcessCheckout()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos Incompletos',
        detail: 'Por favor complete toda la información requerida'
      });
      return;
    }

    this.processing.set(true);

    try {
      const customerId = parseInt(localStorage.getItem('customer_id') || '0');
      const cartId = this.cartStore.cartId();
      
      if (!customerId) {
        throw new Error('Usuario no autenticado');
      }

      if (!cartId) {
        throw new Error('No hay carrito activo');
      }

      // Preparar datos de checkout según la opción elegida
      let checkoutData: any = {
        customer_id: customerId,
        payment_method: this.selectedPaymentMethod(),
        shipping_cost: this.shippingCost(), // Costo de envío calculado
        discount: this.discount() // Descuento aplicado (cupones/promociones)
        // notes removed - backend Order model doesn't have this field
      };

      // Agregar payment_provider si el método lo requiere
      if (this.selectedPaymentProvider()) {
        checkoutData.payment_provider = this.selectedPaymentProvider();
      }

      // Opción 1: Usar dirección existente
      if (this.selectedAddressId() && !this.showNewAddressForm) {
        checkoutData.shipping_address_id = this.selectedAddressId();
      } 
      // Opción 2: Crear nueva dirección sobre la marcha
      else if (this.showNewAddressForm && this.isNewAddressValid()) {
        checkoutData.shipping_address = {
          line1: this.checkoutForm.get('street')?.value,
          city: this.checkoutForm.get('city')?.value,
          state: this.checkoutForm.get('state')?.value || '',
          zip: this.checkoutForm.get('postal_code')?.value,
          country: this.checkoutForm.get('country')?.value || 'Bolivia'
          // notes removed - backend Address model doesn't need this field
        };
      } else {
        throw new Error('Debe seleccionar o crear una dirección de envío');
      }

      console.log('[Checkout] Enviando datos:', checkoutData);

      const checkoutResponse = await this.checkoutService.checkout(cartId, checkoutData).toPromise();

      console.log('[Checkout] Respuesta:', checkoutResponse);

      // Verificar si es pago VPAY
      if (checkoutResponse!.vpay_qr) {
        this.handleVPayCheckout(checkoutResponse!);
      } else {
        // Pago auto-confirmado (MOCK, CASH, etc.)
        this.handleAutoConfirmedCheckout(checkoutResponse!);
      }

    } catch (error: any) {
      console.error('[Checkout] Error:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.error?.detail || error.error?.error || error.message || 'Hubo un error al procesar tu pedido'
      });
    } finally {
      this.processing.set(false);
    }
  }

  handleVPayCheckout(response: any): void {
    // Guardar datos del pedido
    this.orderId.set(response.id);
    this.orderNumber.set(response.order_number);
    
    // Convertir base64 a imagen
    this.qrImage.set(`data:image/png;base64,${response.vpay_qr.qr_image}`);
    
    // Mostrar modal con QR
    this.showQRModal.set(true);
    
    // Iniciar polling
    this.startPaymentPolling();
    
    this.messageService.add({
      severity: 'info',
      summary: 'Pago Pendiente',
      detail: 'Escanea el código QR para completar el pago',
      sticky: true
    });
  }

  handleAutoConfirmedCheckout(response: any): void {
    // Verificar que el pedido fue confirmado automáticamente
    if (response.status === 'CONFIRMED' && response.payment_status === 'PAID') {
      this.messageService.add({
        severity: 'success',
        summary: '¡Compra Exitosa!',
        detail: `Tu pedido #${response.order_number} ha sido confirmado`,
        life: 5000
      });
    } else {
      this.messageService.add({
        severity: 'success',
        summary: 'Pedido Creado',
        detail: `Tu pedido #${response.order_number} ha sido creado`,
        life: 5000
      });
    }

    // Limpiar carrito local
    this.cartStore.clear();
    
    // Redirigir a página de éxito con el pedido
    this.router.navigate(['/shopping/order-success'], {
      state: { order: response }
    });
  }

  startPaymentPolling(): void {
    this.pollingAttempts.set(0);
    this.remainingSeconds.set(300); // Reiniciar timer a 5 minutos
    
    // Temporizador de cuenta regresiva (cada 1 segundo)
    this.timerSubscription = interval(1000).pipe(
      takeWhile(() => this.remainingSeconds() > 0)
    ).subscribe(() => {
      this.remainingSeconds.update(s => Math.max(0, s - 1));
      
      // Si el tiempo se agota, detener todo
      if (this.remainingSeconds() === 0) {
        this.handlePaymentTimeout();
      }
    });
    
    // Polling de estado de pago (cada 3 segundos)
    this.pollingSubscription = interval(3000).pipe(
      takeWhile(() => this.pollingAttempts() < this.maxPollingAttempts && this.remainingSeconds() > 0),
      switchMap(() => {
        this.pollingAttempts.update(n => n + 1);
        return this.checkoutService.checkVPayPaymentStatus(this.orderId()!);
      })
    ).subscribe({
      next: (response) => {
        console.log(`[VPAY] Intento ${this.pollingAttempts()}:`, response);
        
        if (response.payment_status === 'PAID') {
          // ¡Pago confirmado!
          this.handlePaymentSuccess(response);
        } else if (this.pollingAttempts() >= this.maxPollingAttempts) {
          // Timeout
          this.handlePaymentTimeout();
        }
        // Si aún está PENDING, continúa el polling
      },
      error: (error) => {
        console.error('[VPAY] Error verificando pago:', error);
        // Continuar polling aunque haya error
      }
    });
  }

  handlePaymentSuccess(response: any): void {
    // Detener polling
    this.stopPolling();
    
    // Cerrar modal
    this.showQRModal.set(false);
    
    // Limpiar toastr anterior
    this.messageService.clear();
    
    // Mostrar éxito
    this.messageService.add({
      severity: 'success',
      summary: '¡Pago Exitoso!',
      detail: `Pedido ${this.orderNumber()} confirmado y pagado`,
      life: 5000
    });
    
    // Limpiar carrito
    this.cartStore.clear();
    
    // Redirigir a página de éxito
    this.router.navigate(['/shopping/order-success'], {
      state: { order: response }
    });
  }

  handlePaymentTimeout(): void {
    this.stopPolling();
    
    this.messageService.clear();
    this.messageService.add({
      severity: 'warn',
      summary: 'Tiempo Agotado',
      detail: 'El tiempo de espera ha expirado. Puedes verificar tu pedido en "Mis Pedidos"',
      life: 8000
    });
    
    this.showQRModal.set(false);
    
    // Redirigir a mis pedidos
    this.router.navigate(['/shopping/my-orders']);
  }

  cancelVPayPayment(): void {
    this.stopPolling();
    this.showQRModal.set(false);
    this.messageService.clear();
    
    this.messageService.add({
      severity: 'info',
      summary: 'Pago Cancelado',
      detail: 'Has cancelado el proceso de pago'
    });
  }

  stopPolling(): void {
    // Detener polling de estado de pago
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = null;
    }
    
    // Detener temporizador
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }

  toggleNewAddressForm(): void {
    this.showNewAddressForm = !this.showNewAddressForm;
    if (this.showNewAddressForm) {
      this.selectedAddressId.set(null);
      this.selectedAddressIdModel = null;
    }
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }

  goToShop(): void {
    this.router.navigate(['/products']);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }
}
