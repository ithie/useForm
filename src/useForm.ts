import { computed } from 'vue'
import { UseFormData } from './types'
import useInitField from './composables/useInitField/useInitField'
import formStore, { initForm } from './formStore'

export const useForm = (formKey: string): UseFormData => {
  initForm(formKey)

  const initField = useInitField(formKey)
  return {
    initField,
    /**
     * Evaluates the isValid-state of every field registered to the current formKey.
     *
     * @returns ComputedRef<boolean>
     */
    isValid: computed(() => {
      const currentForm = formStore[formKey]!.value

      return Object.keys(currentForm).every((fieldKey) => currentForm[fieldKey].isValid.value)
    })
  }
}
