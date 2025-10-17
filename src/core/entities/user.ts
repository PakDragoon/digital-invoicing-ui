export interface User {
  id: string
  name: string
  email: string
  roleId: string
}

export interface IEmployee {
  id: string
  companyId: string
  roleId: string
  email: string
  hashpass: string
  firstName: string
  lastName: string
  phone: string
  isActive: boolean
  roleName: string
  dmsEmployeeId: string
  currentStatusId: string
  statusName: string
  createdAt: string
  updatedAt: string
}
