import { ComputedRef, Ref } from 'vue'
import { ValidationFunction } from './ValidationFunction'

export default interface IFieldData<T> {
  name: string
  isValid: ComputedRef<boolean>
  value: T
  validationError: Ref<string>
  validations?: ValidationFunction<T>[]
}
