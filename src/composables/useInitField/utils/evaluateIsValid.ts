import IFieldData from '@/types/IFieldData'

export default <T>({ validations, value }: IFieldData<T>): [boolean, string] => {
  let isValid = true
  let validationError = ''

  if (!validations) {
    return [isValid, validationError]
  }
  for (let i = 0; i < validations.length; i++) {
    const errorMessage = validations[i](value as T)

    if (errorMessage) {
      isValid = false
      validationError = errorMessage
      break
    }
  }

  return [isValid, validationError]
}
