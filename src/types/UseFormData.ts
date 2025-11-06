import { ComputedRef } from 'vue'
import { type InitFieldData } from './InitFieldData'

export type UseFormData = {
  isValid: ComputedRef<boolean>
  initField: <T>(fieldData: InitFieldData<T>) => void
}
