import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ParameterOption {
  value: string;
  label: string;
}

interface BuildParameter {
  name: string;
  label: string;
  type: 'text' | 'select' | 'checkbox' | 'textarea' | 'number';
  value: any;
  defaultValue: any;
  required: boolean;
  placeholder?: string;
  description?: string;
  options?: ParameterOption[];
  min?: number;
  max?: number;
}

@Component({
  selector: 'app-build-parameters-modal',
  templateUrl: './build-parameters-modal.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class BuildParametersModalComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() pipelineName: string = '';
  @Output() onClose = new EventEmitter<void>();
  @Output() onTrigger = new EventEmitter<any>();

  parameters: BuildParameter[] = [];

  ngOnInit(): void {
    this.loadParameters();
  }

  loadParameters(): void {
    this.parameters = [
      {
        name: 'environment',
        label: 'Target Environment',
        type: 'select',
        value: 'dev',
        defaultValue: 'dev',
        required: true,
        description: 'Select the environment to deploy to',
        options: [
          { value: 'dev', label: 'Development' },
          { value: 'qa', label: 'QA/Testing' },
          { value: 'staging', label: 'Staging' },
          { value: 'production', label: 'Production' }
        ]
      },
      {
        name: 'branch',
        label: 'Branch/Tag',
        type: 'text',
        value: 'main',
        defaultValue: 'main',
        required: true,
        placeholder: 'e.g., main, develop, feature/xyz',
        description: 'Git branch or tag to build from'
      },
      {
        name: 'version',
        label: 'Version Number',
        type: 'text',
        value: '',
        defaultValue: '',
        required: false,
        placeholder: 'e.g., 1.2.3',
        description: 'Optional: Specify version number for this build'
      },
      {
        name: 'runTests',
        label: 'Run Tests',
        type: 'checkbox',
        value: true,
        defaultValue: true,
        required: false,
        description: 'Execute unit and integration tests during build'
      },
      {
        name: 'runSecurityScan',
        label: 'Run Security Scan',
        type: 'checkbox',
        value: true,
        defaultValue: true,
        required: false,
        description: 'Perform security vulnerability scanning'
      },
      {
        name: 'skipStages',
        label: 'Skip Stages (Optional)',
        type: 'select',
        value: '',
        defaultValue: '',
        required: false,
        description: 'Skip specific pipeline stages if needed',
        options: [
          { value: '', label: 'None - Run all stages' },
          { value: 'tests', label: 'Skip Tests' },
          { value: 'security', label: 'Skip Security Scan' },
          { value: 'deploy', label: 'Skip Deployment' }
        ]
      },
      {
        name: 'buildTimeout',
        label: 'Build Timeout (minutes)',
        type: 'number',
        value: 30,
        defaultValue: 30,
        required: true,
        min: 5,
        max: 120,
        description: 'Maximum time allowed for build execution'
      },
      {
        name: 'customArgs',
        label: 'Custom Build Arguments',
        type: 'textarea',
        value: '',
        defaultValue: '',
        required: false,
        placeholder: 'Enter custom arguments (one per line)',
        description: 'Additional arguments to pass to the build process'
      },
      {
        name: 'notifyOnFailure',
        label: 'Send Notification on Failure',
        type: 'checkbox',
        value: true,
        defaultValue: true,
        required: false,
        description: 'Send email/Slack notification if build fails'
      }
    ];
  }

  closeModal(): void {
    this.onClose.emit();
  }

  triggerBuild(): void {
    if (!this.isFormValid()) {
      alert('Please fill all required fields');
      return;
    }

    const buildParams: any = {};
    this.parameters.forEach(param => {
      buildParams[param.name] = param.value;
    });

    this.onTrigger.emit(buildParams);
    this.closeModal();
  }

  resetToDefaults(): void {
    this.parameters.forEach(param => {
      param.value = param.defaultValue;
    });
  }

  isFormValid(): boolean {
    return this.parameters
      .filter(p => p.required)
      .every(p => {
        if (p.type === 'checkbox') return true;
        return p.value !== '' && p.value !== null && p.value !== undefined;
      });
  }
}