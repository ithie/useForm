// eslint.config.js (oder eslint.config.cjs)
import globals from 'globals'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'
import vueParser from 'vue-eslint-parser'

const vuePlugin = {
  ...vue.configs['flat/recommended'],
  plugins: { vue },
  rules: {
    ...vue.configs['flat/recommended'].rules,
    'vue/multi-word-component-names': 'off'
  }
}

export default tseslint.config(
  js.configs.recommended,

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.vue'],
    ...vuePlugin,
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    }
  },
  {
    files: ['**/*.{ts,js,vue}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  prettier
)
