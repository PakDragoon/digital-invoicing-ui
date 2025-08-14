import React, { useMemo } from 'react';
import { getSignupStepFields } from '@/pages/signup/SignUpFormConfig';
import DynamicField from '@/features/auth/components/DynamicField';
import { useCompaniesName, useOnboardingRoles } from '@/features/auth/hooks/signupOptions';

const StepFields: React.FC<{ step: number }> = ({ step }) => {
  const { data: companiesName = [], isLoading: isLoadingCompanies } = useCompaniesName();
  const { data: onboardingRoles = [], isLoading: isLoadingRoles } = useOnboardingRoles();
  const signupStepFields = useMemo( () => getSignupStepFields(companiesName, onboardingRoles), [companiesName, onboardingRoles] );
  const fields = signupStepFields[step] || [];

  if (isLoadingCompanies || isLoadingRoles) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {fields.map((field) => {
        const key = `${field.field}-${step}`;
        const fullWidthClass = field.config?.fullWidth ? 'md:col-span-2' : 'md:col-span-1';

        return (
          <div key={key} className={fullWidthClass}>
            <DynamicField fieldConfig={field} />
          </div>
        );
      })}
    </div>
  );
};

export default StepFields;
