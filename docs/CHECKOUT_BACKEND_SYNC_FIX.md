# 🔧 Fix: Sincronización Frontend-Backend Checkout

**Fecha:** 2025-11-12  
**Componente:** Checkout  
**Issue:** Error 500 en endpoint `/api/sales/carts/{id}/checkout/`

---

## 🐛 Problema Detectado

El backend Django corrigió el modelo `Order` y el endpoint de checkout eliminando campos que no existían en la base de datos. El frontend Angular todavía estaba enviando esos campos, causando errores 500.

### Campos Eliminados del Backend:
- ❌ `notes` - No existe en el modelo Order
- ❌ `tax` - Se calcula como variable local, no se guarda
- ❌ `shipping_cost` - Campo correcto es `shipping_total`
- ❌ `discount` - Campo correcto es `discount_total`

---

## ✅ Cambios Aplicados en Frontend

### 1. `checkout.component.ts`

#### Formulario ReactiveForm:
```typescript
// ANTES:
this.checkoutForm = this.fb.group({
  street: [''],
  city: [''],
  state: [''],
  country: ['Bolivia'],
  postal_code: [''],
  save_address: [false],
  notes: ['']  // ❌ REMOVIDO
});

// DESPUÉS:
this.checkoutForm = this.fb.group({
  street: [''],
  city: [''],
  state: [''],
  country: ['Bolivia'],
  postal_code: [''],
  save_address: [false]
  // notes removed - backend Order model doesn't have this field
});
```

#### Datos de Checkout:
```typescript
// ANTES:
let checkoutData: any = {
  customer_id: customerId,
  payment_method: this.selectedPaymentMethod(),
  notes: this.checkoutForm.get('notes')?.value || undefined  // ❌ REMOVIDO
};

// DESPUÉS:
let checkoutData: any = {
  customer_id: customerId,
  payment_method: this.selectedPaymentMethod()
  // notes removed - backend Order model doesn't have this field
};
```

#### Datos de Nueva Dirección:
```typescript
// ANTES:
checkoutData.shipping_address = {
  line1: this.checkoutForm.get('street')?.value,
  city: this.checkoutForm.get('city')?.value,
  state: this.checkoutForm.get('state')?.value || '',
  zip: this.checkoutForm.get('postal_code')?.value,
  country: this.checkoutForm.get('country')?.value || 'Bolivia',
  notes: this.checkoutForm.get('notes')?.value || undefined  // ❌ REMOVIDO
};

// DESPUÉS:
checkoutData.shipping_address = {
  line1: this.checkoutForm.get('street')?.value,
  city: this.checkoutForm.get('city')?.value,
  state: this.checkoutForm.get('state')?.value || '',
  zip: this.checkoutForm.get('postal_code')?.value,
  country: this.checkoutForm.get('country')?.value || 'Bolivia'
  // notes removed - backend Address model doesn't need this field
};
```

### 2. `checkout.component.html`

```html
<!-- ANTES: -->
<!-- Notas Adicionales -->
<div class="surface-card border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden">
  <div class="p-4 bg-surface-50 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700">
    <h2 class="text-lg font-semibold flex items-center gap-2">
      <i class="pi pi-comment text-primary"></i>
      Notas (Opcional)
    </h2>
  </div>

  <div class="p-5">
    <form [formGroup]="checkoutForm">
      <textarea 
        pInputTextarea 
        formControlName="notes" 
        rows="3" 
        class="w-full"
        placeholder="Ej: Tocar el timbre, entregar en portería..."
      ></textarea>
    </form>
  </div>
</div>

<!-- DESPUÉS: -->
<!-- Notas Adicionales - REMOVED: Backend Order model doesn't have notes field -->
<!-- Toda la sección comentada -->
```

---

## 📋 Campos Correctos del Backend

Según la corrección del backend, el modelo `Order` acepta:

### Campos Requeridos:
- ✅ `customer` (ForeignKey)
- ✅ `order_number` (CharField, auto-generado por backend)

### Campos con Default:
- ✅ `status` (default='CREATED')
- ✅ `payment_status` (default='PENDING')
- ✅ `currency` (default='BOB')
- ✅ `subtotal` (default=0)
- ✅ `discount_total` (default=0, no "discount")
- ✅ `shipping_total` (default=0, no "shipping_cost")
- ✅ `total` (default=0)

### Campos Opcionales:
- ✅ `shipping_address` (ForeignKey, nullable)

### Campos que NO Existen:
- ❌ `notes`
- ❌ `tax` (se calcula pero no se guarda)
- ❌ `shipping_cost` (usar `shipping_total`)
- ❌ `discount` (usar `discount_total`)

---

## 🎯 Resultado

✅ **Frontend sincronizado con backend**  
✅ **Campo `notes` eliminado del formulario**  
✅ **Campo `notes` eliminado de la UI**  
✅ **Campo `notes` eliminado del payload de checkout**  
✅ **Checkout debería funcionar correctamente ahora**

---

## 🧪 Pruebas Recomendadas

1. **Checkout con dirección existente:**
   ```
   POST /api/sales/carts/{id}/checkout/
   {
     "customer_id": 1,
     "payment_method": "CASH",
     "shipping_address_id": 1
   }
   ```

2. **Checkout con nueva dirección:**
   ```
   POST /api/sales/carts/{id}/checkout/
   {
     "customer_id": 1,
     "payment_method": "VPAY",
     "payment_provider": "VPAY",
     "shipping_address": {
       "line1": "Av. Principal 123",
       "city": "Santa Cruz",
       "state": "SC",
       "zip": "0000",
       "country": "Bolivia"
     }
   }
   ```

3. **Verificar que no se envíe `notes` en ningún caso**

---

## 📝 Próximos Pasos (Opcional)

Si en el futuro se requiere agregar notas:

### Opción 1: Agregar campo en backend
```python
# En sales/models.py
class Order(models.Model):
    # ... otros campos ...
    notes = models.TextField(blank=True, null=True)
```

### Opción 2: Usar campo existente
- Usar `shipping_address.line2` para notas de dirección
- Crear modelo separado `OrderNote` para notas generales

---

*Cambios aplicados - 2025-11-12*
