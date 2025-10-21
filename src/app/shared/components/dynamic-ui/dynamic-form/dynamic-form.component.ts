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
  @Input() buttons: ButtonConfig[] = [];

  @Output() formSubmit = new EventEmitter<any>();
  @Output() buttonClick = new EventEmitter<{ key: string, value: any }>();

  form!: FormGroup;
  apiOptions: Record<string, any[]> = {};
  tagsMap: Record<string, string[]> = {};
  attachmentsMap: Record<string, string[]> = {};
  loadingFields: Record<string, boolean> = {};

  constructor(private readonly fb: FormBuilder, private readonly http: HttpClient) { }

  ngOnInit(): void {
    const group: any = {};
    this.cmsConfig.forEach(field => {
      const initialValue = this.apiData[field.key] ?? field.defaultValue ?? '';

      if (field.type === 'tags') {
        let tags: string[];
        if (Array.isArray(initialValue)) {
          tags = initialValue;
        } else if (initialValue) {
          tags = initialValue.toString().split(',').map((t: string) => t.trim());
        } else {
          tags = [];
        }
        this.tagsMap[field.key] = tags;
      }

      if (field.type === 'file')
        this.attachmentsMap[field.key] = Array.isArray(initialValue) ? initialValue : [];

      group[field.key] = [
        { value: initialValue, disabled: !!field.readonly },
        this.getValidators(field)
      ];
    });

    this.form = this.fb.group(group);
  }

  /** Dynamically assign validators from JSON */
  private getValidators(field: FieldConfig) {
    const v = [];
    const validations = (field as any).validations;
    if (field.required) v.push(Validators.required);
    if (validations?.minLength) v.push(Validators.minLength(validations.minLength));
    if (validations?.maxLength) v.push(Validators.maxLength(validations.maxLength));
    if (validations?.email) v.push(Validators.email);
    if (validations?.pattern) v.push(Validators.pattern(validations.pattern));
    return v;
  }

  onInputChange(field: FieldConfig, event: any) {
    if (!field.apiTrigger) return;
    const value = event.target.value;

    if (value.length >= field.apiTrigger.minLength) {
      this.loadingFields[field.key] = true;
      this.http.get<any[]>(`${field.apiTrigger.apiUrl}?q=${value}`).subscribe({
        next: res => {
          this.apiOptions[field.key] = res.map(r => ({
            label: r[field.apiTrigger!.mapLabel],
            value: r[field.apiTrigger!.mapValue]
          }));
          this.loadingFields[field.key] = false;
        },
        error: () => {
          this.loadingFields[field.key] = false;
        }
      });
    }
  }

  handleOptionSelect(field: FieldConfig, opt: any) {
    this.form.get(field.key)?.setValue(opt.value);
    this.apiOptions[field.key] = [];
  }

  handleButtonClick(btn: ButtonConfig) {
    if (btn.type === 'submit') {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        const firstInvalid = document.querySelector('.ng-invalid');
        if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      this.formSubmit.emit(this.form.value);
    } else {
      this.buttonClick.emit({ key: btn.key, value: this.form.value });
    }
  }

  addTag(field: FieldConfig, tag: string) {
    if (!tag.trim()) return;
    this.tagsMap[field.key] = this.tagsMap[field.key] || [];
    this.tagsMap[field.key].push(tag.trim());
    this.form.get(field.key)?.setValue(this.tagsMap[field.key].join(','));
  }

  removeTag(field: FieldConfig, tag: string) {
    this.tagsMap[field.key] = this.tagsMap[field.key].filter(t => t !== tag);
    this.form.get(field.key)?.setValue(this.tagsMap[field.key].join(','));
  }

  onTagInputEnter(field: FieldConfig, event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.value.trim()) return;
    this.addTag(field, input.value.trim());
    input.value = '';
  }

  getFieldError(key: string): string | null {
    const control = this.form.get(key);
    if (!control || !control.touched || control.valid) return null;
    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('email')) return 'Invalid email address';
    if (control.hasError('minlength')) return 'Too short';
    if (control.hasError('maxlength')) return 'Too long';
    if (control.hasError('pattern')) return 'Invalid format';
    return 'Invalid input';
  }

  uploadProgress: { [key: string]: number } = {};

  handleFileChange(field: FieldConfig, event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    if (!this.attachmentsMap[field.key]) this.attachmentsMap[field.key] = [];

    Array.from(files).forEach((file) => {
      this.attachmentsMap[field.key].push(file.name);
      this.uploadProgress[field.key] = 0;

      // Simulate file upload progress (replace with real HTTP upload if needed)
      const interval = setInterval(() => {
        if (this.uploadProgress[field.key] >= 100) {
          clearInterval(interval);
        } else {
          this.uploadProgress[field.key] += 10;
        }
      }, 200);
    });

    this.form.get(field.key)?.setValue(this.attachmentsMap[field.key]);
  }

  removeAttachment(field: FieldConfig, file: string) {
    this.attachmentsMap[field.key] = this.attachmentsMap[field.key].filter((f) => f !== file);
    this.form.get(field.key)?.setValue(this.attachmentsMap[field.key]);
  }

  getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();

    switch (ext) {
      case 'pdf':
        return 'pdf';
      case 'xls':
      case 'xlsx':
        return 'excel';
      case 'doc':
      case 'docx':
        return 'word';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return 'image';
      case 'txt':
        return 'text';
      case 'zip':
      case 'rar':
        return 'zip';
      default:
        return 'generic';
    }
  }


}