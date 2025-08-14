import { BASE_URL } from '@/common/utils/authInterceptor'

export const SIGNUP_FORM_TABS = [
  {
    label: "Dealership Details",
    title: "Create New Dealership",
    description: "Let’s start with the basics. Tell us a few key details about your dealership so we can set everything up just right",
  },
  {
    label: "Contact Person",
    title: "Who’s Our Main Contact?",
    description: "Enter the details of the primary contact person for this dealership. We’ll send them an invite to complete the setup and manage dealership operations",
  },
  {
    label: "Security",
    title: "Setup Password",
    description: "Setup a strong password for your account. This will be used to log in to the dealership management system",
  },
  {
    label: "DMS Integration",
    title: "DMS Integration",
    description: "Link your Dealer Management System to keep things flowing smoothly or you can choose to skip",
  },
  {
    label: "Upload CSV",
    title: "Upload CSV",
    description: "Upload a CSV file containing the dealership's user information (e.g., sales staff, managers, service advisors). Ensure the format matches the template provided",
  },
]

export const JOB_STATUS_API_URL = `${BASE_URL}/common/jobs/status`
export const UPLOAD_EMPLOYEE_CSV_API_URL = `${BASE_URL}/employee/invite-employees`
export const UPLOAD_DEAL_CSV_API_URL = `${BASE_URL}/dealership/upload-csv/deals`
