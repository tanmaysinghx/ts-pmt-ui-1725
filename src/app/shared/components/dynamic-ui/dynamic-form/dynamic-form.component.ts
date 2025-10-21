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
  tagsMap: Record<string, string[]> = {};
  attachmentsMap: Record<string, string[]> = {};
  apiSearchInput: { [key: string]: string } = {};
  apiOptions: { [key: string]: any[] } = {};
  loadingFields: { [key: string]: boolean } = {};

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

  getFieldGridClass(field: FieldConfig): string {
    const cols = field.cols || 12;
    // Full width on mobile, responsive on sm and up
    return `col-span-${cols} sm:col-span-${cols} w-full`;
  }

  // Get current display value for input
  getApiInputValue(field: FieldConfig): string {
    const control = this.form.get(field.key);
    if (!control) return '';
    const option = this.apiOptions[field.key]?.find(opt => opt.value === control.value);
    return option ? option.label : control.value || '';
  }

  // Called on typing
  onApiSearchInput(field: FieldConfig, value: string) {
    const control = this.form.get(field.key);
    if (control) {
      control.setValue(value);
    }

    if (value.length >= (field.apiTrigger?.minLength ?? 0)) {
      this.loadingFields[field.key] = true;

      const apiUrl = field.apiTrigger?.apiUrl ?? '';
      const mapLabel = field.apiTrigger?.mapLabel ?? 'label';
      const mapValue = field.apiTrigger?.mapValue ?? 'value';

      fetch(apiUrl)
        .then(res => res.json())
        .then((data: any[]) => {
          this.apiOptions[field.key] = data.map(item => ({
            label: item[mapLabel],
            value: item[mapValue]
          }));
          this.loadingFields[field.key] = false;
        })
        .catch(() => this.loadingFields[field.key] = false);
    } else {
      this.apiOptions[field.key] = [];
    }
  }

  // Called on selecting an option
  handleApiOptionSelect(field: FieldConfig, option: any) {
    const control = this.form.get(field.key);
    console.log('Selected option:', option);
    if (control) {
      control.setValue(option.label);
    }
    this.apiOptions[field.key] = [];
  }

}