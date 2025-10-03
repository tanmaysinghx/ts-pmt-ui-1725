import { Injectable } from '@angular/core';
import { FieldConfig } from './field-config.model';

@Injectable({ providedIn: 'root' })
export class CmsMapperService {

    mapApiToForm(cmsConfig: FieldConfig[], apiResponse: any): any {
        const mapped: any = {};
        cmsConfig.forEach(field => {
            mapped[field.key] = apiResponse && apiResponse[field.key] !== undefined
                ? apiResponse[field.key]
                : null;
        });
        return mapped;
    }

    mapFormToApi(cmsConfig: FieldConfig[], formValue: any): any {
        const payload: any = {};
        cmsConfig.forEach(field => {
            if (formValue[field.key] !== undefined) {
                payload[field.key] = formValue[field.key];
            }
        });
        return payload;
    }
}