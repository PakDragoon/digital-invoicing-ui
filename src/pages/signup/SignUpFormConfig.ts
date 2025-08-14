import { ISignUpFormData } from '@/features/auth/schemas/signupSchema'
import { formatPhoneNumber } from '@/common/utils'
import { OnboardingOption } from '@/features/auth/hooks/signupOptions'

export interface ISignupField {
  type: 'text' | 'email' | 'password' | 'select' | 'radio' | 'file';
  field: keyof ISignUpFormData;
  label: string;
  require: boolean;
  options?: { label: string; value: string }[];
  config?: {
    format?: (phone: string | undefined) => string;
    fullWidth?: boolean;
    placeholder?: string;
    allowCreate?: boolean;
    accept?: string
  };
}

export const defaultValues: Partial<ISignUpFormData> = {
  companyId: "",
  dealershipName: "",
  addressStreet1: "",
  city: "",
  state: "",
  zipCode: "",
  dealershipPhone: "",
  phone: "",
  firstName: "",
  lastName: "",
  roleId: "1",
  email: "",
}

const dmsIntgOptions: { label: string; value: string }[] = [
  { label: 'Reynolds', value: '1' },
  { label: 'Fortellis', value: '2' },
]

export const getSignupStepFields = (companyOptions: OnboardingOption[], onboardingRoles: OnboardingOption[]): Record<number, ISignupField[]> => ({
  0: [
    { type: 'select', field: 'companyId', label: 'Company Name', require: true, options: companyOptions, config: { fullWidth: false } },
    { type: 'text', field: 'dealershipName', label: 'Dealership Name', require: true, config: { fullWidth: false } },
    { type: 'text', field: 'addressStreet1', label: 'Address', require: true, config: { fullWidth: true } },
    { type: 'text', field: 'city', label: 'City', require: true, config: { fullWidth: false } },
    { type: 'text', field: 'state', label: 'State', require: true, config: { fullWidth: false } },
    { type: 'text', field: 'zipCode', label: 'Zip Code', require: true, config: { fullWidth: false } },
    { type: 'text', field: 'dealershipPhone', label: 'Phone Number', require: true, config: { format: formatPhoneNumber, fullWidth: false } },
  ],
  1: [
    { type: 'text', field: 'firstName', label: 'Contact First Name', require: true, config: { fullWidth: false } },
    { type: 'text', field: 'lastName', label: 'Contact Last Name', require: true, config: { fullWidth: false } },
    {
      type: 'select',
      field: 'roleId',
      label: 'Position',
      require: true,
      options: onboardingRoles,
      config: { fullWidth: true, allowCreate: false }
    },
    { type: 'email', field: 'email', label: 'Contact Person Email', require: true, config: { fullWidth: true } },
    { type: 'text', field: 'phone', label: 'Phone Number', require: true, config: { format: formatPhoneNumber, fullWidth: true } },
  ],
  2: [
    { type: 'password', field: 'password', label: 'Password', require: true, config: { fullWidth: true } },
    { type: 'password', field: 'confirmPassword', label: 'Confirm Password', require: true, config: { fullWidth: true } },
  ],
  3: [{
    type: 'radio',
    field: 'dmsIntegration',
    label: 'Select your DMS Provider or you can skip for manual process',
    require: true,
    options: dmsIntgOptions,
    config: { fullWidth: true }
  }],
  4: [
    { type: 'file', field: 'file', label: 'Upload Dealership Data (.csv)', require: true, config: {
      fullWidth: true, accept: ".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
    }},
  ],
})
