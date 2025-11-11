import { Component, OnInit } from '@angular/core';
import {
  AbstractControl, FormBuilder, FormControl, FormGroupDirective, FormGroup,
  NgForm, Validators, ValidationErrors, ValidatorFn
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { RegisterRequest, User } from '../../core/models/auth.model';
import { MessageService } from 'primeng/api';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./../login/login.component.scss'],
    standalone: true,
    imports: [SharedModule],
    providers: [MessageService]
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  registerSubscription!: Subscription;
  loading = false;
  selectedPlan = 'free'; // Plan por defecto

  constructor(
    private authService: AuthService,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.initFormBuilder();
  }

  ngOnInit() {
    // Obtener plan desde query params (viene del landing)
    this.route.queryParams.subscribe(params => {
      if (params['plan']) {
        this.selectedPlan = params['plan'];
        console.log('Plan seleccionado desde landing:', this.selectedPlan);
      }
    });
  }

  registerUser() {
    if (this.form.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario Inválido',
        detail: 'Por favor complete todos los campos correctamente'
      });
      return;
    }

    this.loading = true;

    // Register with JWT auth - Clientes API
    const registerRequest: RegisterRequest = {
      username: this.form.value.email,
      email: this.form.value.email,
      password: this.form.value.password,
      password2: this.form.value.passwordConfirmation, // Requerido por el backend
      first_name: this.form.value.fullName?.split(' ')[0] || '',
      last_name: this.form.value.fullName?.split(' ').slice(1).join(' ') || ''
    };

    this.registerSubscription = this.authService
      .register(registerRequest)
      .subscribe({
        next: (user: User) => {
          console.log("Registro exitoso:", user);
          this.messageService.add({
            severity: 'success',
            summary: 'Registro Exitoso',
            detail: `Bienvenido ${user.first_name}. Ya puedes iniciar sesión.`
          });
          
          // Redirigir al login después de 2 segundos
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (error: any) => {
          console.error('Error en registro:', error);
          this.loading = false;
          
          let errorMessage = 'Error al registrar el usuario';
          if (error.error?.username) {
            errorMessage = 'El nombre de usuario ya está en uso';
          } else if (error.error?.email) {
            errorMessage = 'El email ya está registrado';
          } else if (error.status === 0) {
            errorMessage = 'No se pudo conectar con el servidor';
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage
          });
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  private initFormBuilder() {
    this.form = this.formBuilder.group({
      orgName: ['', [Validators.required, Validators.minLength(3)]],
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]],
      password: ['', [
        Validators.required,
        this.regexValidator(new RegExp('(?=.*?[0-9])'), { 'at-least-one-digit': true }),
        this.regexValidator(new RegExp('(?=.*[a-z])'), { 'at-least-one-lowercase': true }),
        this.regexValidator(new RegExp('(?=.*[A-Z])'), { 'at-least-one-uppercase': true }),
        this.regexValidator(new RegExp('(?=.*[!@#$%^&*])'), { 'at-least-one-special-character': true }),
        this.regexValidator(new RegExp('(^.{8,}$)'), { 'at-least-eight-characters': true }),
      ]],
      passwordConfirmation: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }

  private checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.controls['password'].value;
    const confirmPass = group.controls['passwordConfirmation'].value;
    return pass === confirmPass ? null : { notSame: true };
  }

  private regexValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null;
      }
      const valid = regex.test(control.value);
      return valid ? null : error;
    };
  }
}
