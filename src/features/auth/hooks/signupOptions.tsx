import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getCompaniesName, getOnboardingRoles } from '@/features/auth/services/authApi'

export type OnboardingOption = { label: string, value: string }

export const useCompaniesName = (): UseQueryResult<OnboardingOption[], unknown> => {
  return useQuery<OnboardingOption[]>({
    queryKey: ["getCompaniesName"],
    queryFn: () => getCompaniesName(),
    retry: false
  });
};

export const useOnboardingRoles = (): UseQueryResult<OnboardingOption[], unknown> => {
  return useQuery<OnboardingOption[]>({
    queryKey: ["getOnboardingRoles"],
    queryFn: () => getOnboardingRoles(),
    retry: false
  });
};
