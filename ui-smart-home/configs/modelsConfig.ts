export interface Device {
    id: string;
    type: string;
    name: string;
    isActive: boolean;
    detailType: string;
    properties?: {
        [key: string]: string | number | boolean;
    };
    unit?: string;
    value: string | number | boolean;
}

