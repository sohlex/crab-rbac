import { union, some, head, includes } from 'lodash'

export default class Rbac {
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

    Rbac.rolesToPermissionsMap = map
    Rbac.initialized = true
    return Rbac.initialized
  }

  static can (operation: string, ...roles: string[]): boolean {
    if (roles.length === 0) {
      throw Error(`roles parameter is not valid`)
    }
    return some(roles, role => {
      const permissions = Rbac.rolesToPermissionsMap.get(role)
      return includes(permissions, operation)
    })
  }

  static capabilitiesOf (role: string): string[] {
    return Rbac.rolesToPermissionsMap.get(role) || []
  }

  static listRoles (): string[] {
    return Array.from(Rbac.rolesToPermissionsMap.keys())
  }

  static get isInitialized (): boolean {
    return Rbac.initialized
  }
}

export interface Role {
  name: string,
  permissions: string[],
  inherits: string[]
}
