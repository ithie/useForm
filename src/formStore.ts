import { ref } from 'vue'
import { FormDataRef } from './types/FormDataRef'

const formStore = <Record<string, FormDataRef | undefined>>{}

export const initForm = (formKey: string) => {
  if (!formStore[formKey]) {
    formStore[formKey] = ref({})
  }
}

export default formStore
