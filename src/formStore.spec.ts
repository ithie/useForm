import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockRef } = vi.hoisted(() => {
  return {
    mockRef: vi.fn((val) => ({ value: val, isMock: true }))
  }
})

vi.mock('vue', () => ({
  ref: mockRef
}))

import formStore, { initForm } from './formStore'

describe('formStore', () => {
  const TEST_KEY = 'signupForm'

  beforeEach(() => {
    delete formStore[TEST_KEY]
    vi.clearAllMocks()
  })

  it('should export an empty Record object by default', () => {
    expect(typeof formStore).toBe('object')
    expect(Object.keys(formStore).length).toBe(0)
  })

  it('should initialize and register a new ref object for a unique formKey', () => {
    initForm(TEST_KEY)

    expect(mockRef).toHaveBeenCalledWith({})

    expect(formStore[TEST_KEY]).toBeDefined()

    expect((formStore[TEST_KEY]! as unknown as { isMock: boolean }).isMock).toBe(true)
  })

  it('should NOT call ref() again if the formKey already exists', () => {
    initForm(TEST_KEY)

    mockRef.mockClear()

    initForm(TEST_KEY)

    expect(mockRef).not.toHaveBeenCalled()

    expect(formStore[TEST_KEY]).toBeDefined()
  })
})
