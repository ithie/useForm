import IFieldData from './IFieldData'

export type InitFieldData<T> = Omit<Omit<IFieldData<T>, 'isValid'>, 'validationError'>
