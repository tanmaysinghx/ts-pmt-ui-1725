export interface FieldConfig {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'file' | 'api-search' | 'tags';
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
}

export interface ButtonConfig {
    key: string;
    label: string;
    style?: 'primary' | 'secondary' | 'danger';
    type?: 'submit' | 'button';
}
