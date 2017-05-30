import { union, some, head, includes } from 'lodash'

export class rbac {
  private static initialized: boolean = false
  private static rolesToPermissionsMap: Map<string, string[]>

  static init (roles: Role[]): boolean {
    const map = new Map<string, string[]>()

    roles.forEach(role => {
        const allPermissions = role.inherits.reduce((accumulator, childName) => {
          const childRoles = roles.filter(role => role.name === childName)
          if (childRoles.length > 1) {
            throw new Error(`${childName} role is defined more than once`)
          }
          const childRole = head(childRoles)
          return accumulator = union(accumulator, childRole.permissions)
        }, [...role.permissions])
      map.set(role.name, allPermissions)
    })

    rbac.rolesToPermissionsMap = map
    rbac.initialized = true
    return rbac.initialized
  }

  static can (operation: string, ...roles: string[]): boolean {
    if (roles.length === 0) {
      throw Error(`roles parameter is not valid`)
    }
    return some(roles, role => {
      const permissions = rbac.rolesToPermissionsMap.get(role)
      return includes(permissions, operation)
    })
  }

  static capabilitiesOf (role: string): string[] {
    return rbac.rolesToPermissionsMap.get(role) || []
  }

  static listRoles (): string[] {
    return Array.from(rbac.rolesToPermissionsMap.keys())
  }

  static get isInitialized (): boolean {
    return rbac.initialized
  }
}

export interface Role {
  name: string,
  permissions: string[],
  inherits: string[]
}
