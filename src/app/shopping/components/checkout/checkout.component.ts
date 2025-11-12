import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
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
export class CheckoutComponent implements OnInit {
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

  showNewAddressForm = false;
  selectedAddressIdModel: number | null = null;
  selectedPaymentMethodModel: PaymentMethod = 'CASH';

  cartItems = this.cartStore.items;
  subtotal = this.cartStore.totalAmount;
  tax = computed(() => this.subtotal() * 0.13);
  shippingCost = computed(() => this.subtotal() >= 200 ? 0 : 30);
  total = computed(() => this.subtotal() + this.tax() + this.shippingCost());

  paymentMethods = [
    { value: 'CREDIT_CARD' as PaymentMethod, label: PAYMENT_METHOD_LABELS['CREDIT_CARD'], icon: 'pi pi-credit-card' },
    { value: 'DEBIT_CARD' as PaymentMethod, label: PAYMENT_METHOD_LABELS['DEBIT_CARD'], icon: 'pi pi-credit-card' },
    { value: 'CASH' as PaymentMethod, label: PAYMENT_METHOD_LABELS['CASH'], icon: 'pi pi-money-bill' },
    { value: 'BANK_TRANSFER' as PaymentMethod, label: PAYMENT_METHOD_LABELS['BANK_TRANSFER'], icon: 'pi pi-building-columns' },
    { value: 'QR' as PaymentMethod, label: PAYMENT_METHOD_LABELS['QR'], icon: 'pi pi-qrcode' }
  ];

  paymentProviders = [
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
      save_address: [false],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadAddresses();
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
    if (method !== 'CREDIT_CARD' && method !== 'DEBIT_CARD') {
      this.selectedPaymentProvider.set(null);
    }
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
      if (!customerId) {
        throw new Error('Usuario no autenticado');
      }

      let addressId = this.selectedAddressId();
      
      if (this.showNewAddressForm) {
        const newAddressData: CreateAddressRequest = {
          customer: customerId,
          street: this.checkoutForm.get('street')?.value,
          city: this.checkoutForm.get('city')?.value,
          state: this.checkoutForm.get('state')?.value || undefined,
          country: this.checkoutForm.get('country')?.value,
          postal_code: this.checkoutForm.get('postal_code')?.value,
          is_default: this.addresses().length === 0
        };

        const newAddress = await this.addressService.createAddress(newAddressData).toPromise();
        addressId = newAddress!.id;

        if (this.checkoutForm.get('save_address')?.value) {
          this.addresses.update(addrs => [...addrs, newAddress!]);
        }
      }

      if (!addressId) {
        throw new Error('No se pudo determinar la dirección de envío');
      }

      const mockCartId = 1;

      const checkoutData = {
        customer_id: customerId,
        shipping_address_id: addressId,
        payment_method: this.selectedPaymentMethod(),
        payment_provider: this.selectedPaymentProvider() || undefined,
        notes: this.checkoutForm.get('notes')?.value || undefined
      };

      const checkoutResponse = await this.checkoutService.checkout(mockCartId, checkoutData).toPromise();

      this.messageService.add({
        severity: 'success',
        summary: 'Pedido Creado',
        detail: `Tu pedido #${checkoutResponse!.order_number} ha sido creado exitosamente`
      });

      this.cartStore.clear();
      this.router.navigate(['/shopping/confirmation'], {
        queryParams: { orderId: checkoutResponse!.id }
      });

    } catch (error: any) {
      console.error('Error en el checkout:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'Hubo un error al procesar tu pedido'
      });
    } finally {
      this.processing.set(false);
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
