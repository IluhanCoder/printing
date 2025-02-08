export interface DataCredentials {
    name: string,
    desc: string,
    dataType: 'material' | 'technology' | 'processing'
}

export interface Data {
    _id: string,
    name: string,
    desc: string,
    dataType: 'material' | 'technology' | 'processing'
}

export const DefaultDataCredentials: DataCredentials = {
    name: "",
    desc: "",
    dataType: "material"
}

export interface DataTypeOption {
    label: string,
    value: string
}

export const DataTypeOptions: DataTypeOption[] = [
    {label: 'матеріал', value: 'material'}, {label: 'технологія', value: 'technology'}, {label: 'післядрукарська обробка', value: 'processing'}
]