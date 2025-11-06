# @ithie/useForm

**A decoupled and reactive Vue 3 Composable for form and field state management, featuring component-level validation.**

This composable provides an efficient, key-based state system that allows individual input components to register and validate their fields. The form state is created implicitly upon the first field registration, simplifying integration into component trees.

## Features

- **Decoupled Field Registration:** Fields are registered by individual input components (initField), enabling deep component nesting.
- **Implicit Form Creation:** The central form state is automatically created when the first field uses a unique formKey, requiring no explicit initialisation in a parent container.
- **Centralized State Access:** Global form status (isValid, isDirty, etc.) is tracked centrally via the unique formKey.
- **Custom Validation Logic:** Easy integration of simple validation functions that return an error message (string) on failure.

## Installation

Install the package using your preferred package manager:

```Bash
# With npm
npm install @ithie/useForm

# With yarn
yarn add @ithie/useForm
```

## Usage

The @ithie/useForm composable is designed to be used by calling it with a unique key, then registering fields within your input components.

### 1. Input Component (MyInputField.vue)

Each individual input component uses the same formKey to register itself. If the form for that key doesn't exist, it's created implicitly here.

```typescript
<script setup>
import { useForm } from '@ithie/useForm';
import { defineProps } from 'vue';

const props = defineProps({
formKey: { type: String, required: true },
fieldName: { type: String, required: true },
initialValue: { type: String, default: '' },
});

// 1. Retrieves the form manager instance for the key (creates it if it doesn't exist)
const { initField } = useForm(props.formKey);

// 2. Registers the field and its validations within the form
const field = initField({
  name: props.fieldName,
  value: props.initialValue,
  validations: [
    (value) => {
        if (!!value) {
            return true
        }
        return "This field is required."
    },
    (value) => {
        if (value.length <= 100) {
            return true
        }

        return "Too many characters (max 100)."
    }
  ],
});
</script>

<template>
  <div class="field-wrapper">
    <label :for="fieldName">{{ fieldName }}:</label>
    <input
      type="text"
      :id="fieldName"
      v-model="field.value"
    />
    <p v-if="field.error" class="error-message">
      {{ field.error }}
    </p>
  </div>
</template>
```

### 2. Form Container (FormContainer.vue)

The parent component uses useForm solely to gain access to the global validation state.

```typescript
<script setup>
import { useForm } from '@ithie/useForm';
import MyInputField from './MyInputField.vue';

const formKey = 'userProfileForm';

const { isValid, getFormData } = useForm(formKey);

const handleSubmit = () => {
  if (isValid.value) {
    console.log('Form is valid.', getFormData());
    // TODO: Send data...
  } else {
    console.log('Form is invalid.');
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <MyInputField
      :form-key="formKey"
      field-name="username"
      initial-value="JohnDoe"
    />

    <MyInputField
      :form-key="formKey"
      field-name="email"
      initial-value=""
    />

    <button type="submit" :disabled="!isValid">
      Submit Profile (Valid: {{ isValid }})
    </button>
  </form>
</template>
```

## API Reference

### `useForm(key: string)`

Retrieves the central form manager instance for a given unique key. If no fields have been registered yet, this call ensures the state is accessible to the parent component.

| Parameter | Type   | Description                                |
| --------- | ------ | ------------------------------------------ |
| key       | string | A unique identifier for the form instance. |

**_Returns:_**

- `isValid`: ComputedRef providing the validation results over alle fields of the form
- `getFormData()`: Function to return the key/value pairs of the form.

### `initField(options: IFieldData)`

Called within an input component's `setup` block to register the field. If the form instance does not yet exist for the given key, it is created implicitly by this call.

| Parameter   | Type          | Description                                   |
| ----------- | ------------- | --------------------------------------------- |
| name        | string        | The unique name of the field within the form. |
| value       | any           | The initial value of the field.               |
| validations | ValidatorFn[] | An array of validation functions.             |

**_Returns:_**

- `Ref<FieldState>`: A reactive reference to the field's data (value, error, isValid, isDirty).

### Validator Function Structure (ValidatorFn)

A validation function takes the current field value and returns either a string or a falsy value:

| Return Value | Interpretation                                     |  Example             |
| ------------ | -------------------------------------------------- | -------------------- |
| string       | Validation Fails. The string is the error message. | "Field is required." |
| falsy value  |  Validation Succeeds.                              | false, null, 0, ""   |

## Contributing

Contributions, issues, and feature requests are welcome!

## License

Distributed under the MIT License.
