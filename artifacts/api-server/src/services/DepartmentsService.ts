import {
  archiveDepartment,
  createDepartment,
  getDepartment,
  getDepartments,
  updateDepartment,
} from "@workspace/db/queries/departments"
import type {
  DepartmentInput,
  DepartmentListQuery,
} from "@workspace/db/queries/departments"

/**
 * Gold-standard sample service.
 *
 * Keep controllers thin. Put business rules, orchestration, tenant scoping,
 * SSO/permission checks, notifications, or audit hooks here.
 */
export const DepartmentsService = {
  list(query: DepartmentListQuery) {
    return getDepartments(query)
  },

  find(id: string) {
    return getDepartment(id)
  },

  create(data: DepartmentInput) {
    return createDepartment(data)
  },

  update(id: string, data: DepartmentInput) {
    return updateDepartment(id, data)
  },

  archive(id: string) {
    // High6 default: archive/soft-disable important business records.
    return archiveDepartment(id)
  },
}
