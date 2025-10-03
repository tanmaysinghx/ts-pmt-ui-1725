import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FieldConfig, ButtonConfig } from '../field-config.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class DynamicFormComponent implements OnInit {
  @Input() title: string = 'Form';
  @Input() cmsConfig: FieldConfig[] = [];
  @Input() apiData: any = {};
  @Input() buttons: ButtonConfig[] = [{ key: 'submit', label: 'Submit', style: 'primary', type: 'submit' }];

  @Output() formSubmit = new EventEmitter<any>();
  @Output() buttonClick = new EventEmitter<{ key: string, value: any }>();

  form!: FormGroup;
  apiOptions: { [key: string]: any[] } = {};

  constructor(private readonly fb: FormBuilder, private readonly http: HttpClient) { }

  ngOnInit(): void {
    const group: any = {};
    this.cmsConfig.forEach(field => {
      // Pick value from API first, then defaultValue, else empty
      const initialValue = this.apiData[field.key] ?? field.defaultValue ?? '';
      const validators = field.required ? [Validators.required] : [];
      group[field.key] = [{ value: initialValue, disabled: !!field.readonly }, validators];
    });
    this.form = this.fb.group(group);
  }

  onInputChange(field: FieldConfig, event: any) {
    if (field.apiTrigger && event.target.value.length >= field.apiTrigger.minLength) {
      this.http.get<any[]>(`${field.apiTrigger.apiUrl}?q=${event.target.value}`).subscribe(res => {
        this.apiOptions[field.key] = res.map(r => ({
          label: r[field.apiTrigger!.mapLabel],
          value: r[field.apiTrigger!.mapValue]
        }));
      });
    }
  }

  handleOptionSelect(field: FieldConfig, opt: any) {
    this.form.get(field.key)?.setValue(opt.value);
    this.apiOptions[field.key] = [];
  }

  handleButtonClick(btn: ButtonConfig) {
    if (btn.type === 'submit') {
      if (this.form.valid) {
        this.formSubmit.emit(this.form.value);
      }
    } else {
      this.buttonClick.emit({ key: btn.key, value: this.form.value });
    }
  }
}