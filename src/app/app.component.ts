import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatStepperModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatTabsModule, MatButtonModule, MatIconModule,ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  Form1: FormGroup;
  Form2: FormGroup;
  serviceTabs: string[] = [];
  providerForms: { [key: string]: FormArray } = {};

  serviceOptions = ['SMS-OTP', 'SMS-NOTP', 'EMAIL-OTP', 'EMAIL-NOTP', 'WHATSAPP-TEMPLATE'];
  providerOptions = ['Provider A', 'Provider B', 'Provider C'];

  constructor(private fb: FormBuilder) {
    this.Form1 = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.Form2 = this.fb.group({
      services: [[], Validators.required]
    });
  }

  nxtbtnfirst() {
    if (this.Form1.valid) {
      console.log('Form1:', this.Form1.value);
    }
    this.Form1.markAllAsTouched();
  }

  nextStep2() {
    if (this.Form2.valid) {
      this.serviceTabs = this.Form2.value.services;
      this.providerForms = {};
      this.serviceTabs.forEach(svc => {
        this.providerForms[svc] = this.fb.array([
          this.fb.group({
            provider: ['', Validators.required],
            weight: [100, [Validators.required, Validators.min(0), Validators.max(100)]]
          })
        ]);
      });
    }
  }

  addProvider(svc: string) {
    this.providerForms[svc].push(
      this.fb.group({
        provider: ['', Validators.required],
        weight: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
      })
    );
  }

  removeProvider(svc: string, index: number) {
    this.providerForms[svc].removeAt(index);
  }

  getProviderControls(svc: string): FormGroup[] {
  return (this.providerForms[svc]?.controls || []) as FormGroup[];
}

  createLOB() {
    const payload = {
      ...this.Form1.value,
      services: this.Form2.value.services,
      providers: Object.keys(this.providerForms).map(svc => ({
        service: svc,
        configs: this.providerForms[svc].value
      }))
    };
    console.log('LOB Created:', payload);
    alert('LOB Created!');
  }
}
