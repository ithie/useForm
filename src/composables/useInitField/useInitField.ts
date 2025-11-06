import { onUnmounted, ref, watch, WatchStopHandle } from 'vue'
import formStore, { initForm } from '../../formStore'
import evaluateIsValid from './utils/evaluateIsValid'
import { InitFieldData } from '@/types/InitFieldData'
import IFieldData from '@/types/IFieldData'

export default (formKey: string) => {
  const isValid = ref(true)
  const validationError = ref('')

  let watchStopHandle: WatchStopHandle | null = null

  return <T>({ name, value, validations }: InitFieldData<T>) => {
    initForm(formKey)

    const form = formStore[formKey]

    onUnmounted(() => {
      if (watchStopHandle !== null) {
        watchStopHandle()
      }
    })

    watchStopHandle = watch(
      () => formStore[formKey]?.value?.[name]?.value,
      (curr, prev) => {
        if (curr !== prev) {
          const [isFieldValid, errorMessage] = evaluateIsValid<T>(form!.value[name])

          isValid.value = isFieldValid
          validationError.value = errorMessage
        }
      }
    )

    if (form) {
      form.value[name] = {
        value,
        validations,
        validationError,
        isValid
      } as IFieldData<T>
    }
  }
}
