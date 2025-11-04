import { describe, expect, it } from 'vitest'
import { useForm } from './useForm'

describe('useForm', () => {
  it('should return demo string', () => {
    expect(useForm().call()).toEqual('called')
  })
})
