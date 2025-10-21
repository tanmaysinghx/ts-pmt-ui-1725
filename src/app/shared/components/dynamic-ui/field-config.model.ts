export interface FieldConfig {
    key: string;
    label: string;
    type: 'select' | 'textarea' | 'text' | 'date' | 'radio' | 'checkbox' | 'file' | 'api-search' | 'tags' | 'color';
    placeholder?: string;
    required?: boolean;
    readonly?: boolean;
    defaultValue?: any;
    tooltip?: string;
    options?: { value: any; label: string }[];
    apiTrigger?: {
        minLength: number;
        apiUrl: string;
        mapLabel: string;
        mapValue: string;
    };
    cols?: number;
}

export interface ButtonConfig {
    key: string;
    label: string;
    type?: 'button' | 'submit' | 'reset';
    style?: 'primary' | 'secondary' | 'danger' | 'success';
}

