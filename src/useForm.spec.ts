// useForm.integration.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'

import formStore from './formStore'
import { useForm } from './useForm'

const TestWrapper = defineComponent({
  props: ['formKey'],
  setup(props) {
    useForm(props.formKey)
  },
  template: '<div></div>'
})

describe('useForm', () => {
  const TEST_FORM_KEY = 'realFormTest'

  beforeEach(() => {
    vi.clearAllMocks()
    formStore[TEST_FORM_KEY] = undefined
  })

  it('should initialize the form and provide reactive isValid and initField', async () => {
    mount(TestWrapper, { props: { formKey: TEST_FORM_KEY } })

    expect(formStore[TEST_FORM_KEY]).toBeDefined()

    expect(useForm(TEST_FORM_KEY).isValid.value).toBe(true)
  })

  it('should reactively update isValid when a field state changes', async () => {
    mount({
      props: ['formKey'],
      setup() {
        const { initField } = useForm(TEST_FORM_KEY)

        initField({
          name: 'firstName',
          value: 'Diego',
          validations: [(val) => (val ? '' : 'Field is required')]
        })
        initField({ name: 'lastName', value: 'Garcia' })
      },
      template: '<div></div>'
    })

    await nextTick()

    expect(useForm(TEST_FORM_KEY).isValid.value).toBeFalsy()

    const fieldRef = formStore[TEST_FORM_KEY]!.value.firstName

    fieldRef.value = ''

    await nextTick()

    expect(fieldRef.isValid.value).toBeFalsy()
    expect(useForm(TEST_FORM_KEY).isValid.value).toBeFalsy()

    fieldRef.value = 'valid-state'

    await nextTick()

    expect(fieldRef.isValid.value).toBeFalsy()
    expect(useForm(TEST_FORM_KEY).isValid.value).toBeFalsy()
  })
})
