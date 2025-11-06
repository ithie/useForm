import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockWatch = vi.fn()

const {
  storeData,
  mockInitForm,
  evaluateIsValidMock,
  mockRef,
  mockOnUnmounted,
  mockWatchStopHandle
} = vi.hoisted(() => {
  return {
    mockRef: vi.fn((val) => ({ value: val, isMockRef: true })),
    mockOnUnmounted: vi.fn(),
    mockWatchStopHandle: vi.fn(),
    evaluateIsValidMock: vi.fn(() => [true, '']),
    storeData: {} as Record<string, FormDataRef | undefined>,
    mockInitForm: vi.fn((formKey) => {
      if (!storeData[formKey]) {
        storeData[formKey] = mockRef({}) as unknown as FormDataRef
      }
    })
  }
})

vi.mock('vue', () => ({
  ref: mockRef,
  computed: vi.fn((fn) => ({ value: fn() })),
  onUnmounted: mockOnUnmounted,
  watch: (source: unknown, cb: unknown) => {
    mockWatch(source, cb)
    return mockWatchStopHandle
  }
}))

vi.mock('../../formStore', () => ({
  initForm: mockInitForm,
  default: storeData
}))

vi.mock('./utils/evaluateIsValid', () => ({
  default: evaluateIsValidMock
}))

import useInitField from './useInitField'
import { FormDataRef } from '@/types/FormDataRef'

describe('useInitField', () => {
  const TEST_FORM_KEY = 'ioForm'

  beforeEach(() => {
    vi.clearAllMocks()
    delete storeData[TEST_FORM_KEY]
  })

  it('should call initForm and register field data with correct structure', () => {
    const mockValidation = vi.fn()

    const registerFieldFn = useInitField(TEST_FORM_KEY)

    registerFieldFn({
      name: 'username',
      value: 'JohnDoe',
      validations: [mockValidation]
    })

    expect(mockInitForm).toHaveBeenCalledWith(TEST_FORM_KEY)

    const formRef = storeData[TEST_FORM_KEY]

    expect(formRef!.value.username).toBeDefined()
    expect(formRef!.value.username.value).toBe('JohnDoe')

    expect(mockWatch).toHaveBeenCalledOnce()
    expect(mockOnUnmounted).toHaveBeenCalledOnce()
  })

  it('should register watcher and ensure stop handle is called on unmount', () => {
    const registerFieldFn = useInitField(TEST_FORM_KEY)
    registerFieldFn({ name: 'email', value: 'a@b.c', validations: [vi.fn()] })

    const unmountCallback = mockOnUnmounted.mock.calls[0][0]
    unmountCallback()

    expect(mockWatchStopHandle).toHaveBeenCalledOnce()
  })
})
