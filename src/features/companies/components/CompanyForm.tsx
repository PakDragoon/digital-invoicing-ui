import React from "react"
import Form from "@rjsf/core"
import validator from "@rjsf/validator-ajv8"
import { IChangeEvent } from "@rjsf/core"
import { useAddCompany } from "../services/companyService"
import { companyJsonSchema } from "../schemas/companySchema"

const CompanyForm = () => {
  const { mutate, isPending } = useAddCompany()

  const handleSubmit = (data: IChangeEvent<any>) => {
    mutate(data.formData)
  }

  return (
    <div style={{ padding: "16px" }}>
      <h2>Add Company</h2>
      <Form
        schema={companyJsonSchema}
        validator={validator}
        onSubmit={handleSubmit} // ✅ Fixed type issue
      >
        <button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Add Company"}
        </button>
      </Form>
    </div>
  )
}

export default CompanyForm
