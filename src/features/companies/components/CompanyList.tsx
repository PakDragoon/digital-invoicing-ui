import React from "react"
import { useCompanies } from "../services/companyService"

const CompanyList = () => {
  const { data: companies, isLoading, error } = useCompanies()

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>Error loading companies</p>

  return (
    <div>
      <h2>Company List</h2>
      <ul>
        {companies?.map((company) => (
          <li key={company.id}>
            <strong>{company.name}</strong> - {company.domain}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CompanyList
