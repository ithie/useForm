// validateField.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest'
import evaluteIsValid from './evaluateIsValid'
import IFieldData from '@/types/IFieldData'
import { ValidationFunction } from '@/types/ValidationFunction'

const successfulValidator = vi.fn(() => null) as unknown as ValidationFunction<string>
const minLengthValidator = vi.fn((value: string) =>
  value.length < 5 ? 'Value is too short' : null
) as unknown as ValidationFunction<string>
const alwaysFailsValidator = vi.fn(() => 'Mandatory error')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('evaluteIsValid', () => {
  it('should return [true, ""] when all validations pass', () => {
    const fieldData = {
      value: 'LongEnoughValue',
      validations: [successfulValidator, minLengthValidator]
    } as IFieldData<string>

    expect(evaluteIsValid<string>(fieldData)).toEqual([true, ''])

    expect(successfulValidator).toHaveBeenCalledOnce()
    expect(minLengthValidator).toHaveBeenCalledOnce()
  })

  it('should return [false, errorMessage] for a single failing rule', () => {
    const fieldData = {
      value: 'four',
      validations: [successfulValidator, minLengthValidator]
    } as IFieldData<string>

    expect(evaluteIsValid<string>(fieldData)).toEqual([false, 'Value is too short'])
  })

  it('should short-circuit and return the error of the first failing validator', () => {
    const fieldData = {
      value: 'ignoredValue',
      validations: [alwaysFailsValidator, minLengthValidator]
    } as IFieldData<string>

    expect(evaluteIsValid<string>(fieldData)).toEqual([false, 'Mandatory error'])

    expect(alwaysFailsValidator).toHaveBeenCalledOnce()
    expect(minLengthValidator).not.toHaveBeenCalled()
  })

  it('should handle non-string values (e.g., numbers)', () => {
    const numberValidator = vi.fn((value: number) =>
      value < 10 ? 'Must be greater than 10' : '>'
    ) as ValidationFunction<number>

    const fieldData = {
      value: 5,
      validations: [numberValidator]
    } as IFieldData<number>

    expect(evaluteIsValid<number>(fieldData)).toEqual([false, 'Must be greater than 10'])
  })
})
