import { union, some, head, includes } from 'lodash'

export class rbac {
  private static initialized: boolean = false
  private static rolesToCapabilitiesMap: Map<string, string[]>

  static init (roles: Role[]): boolean {
    const map = new Map<string, string[]>()

    roles.forEach(role => {
        const allCapabilities = role.inherits.reduce((accumulator, childName) => {
          const childRoles = roles.filter(role => role.name === childName)
          if (childRoles.length > 1) {
            throw new Error(`${childName} role is defined more than once`)
          }
          const childRole = head(childRoles)
          return accumulator = union(accumulator, childRole.capabilities)
        }, [...role.capabilities])
      map.set(role.name, allCapabilities)
    })

    rbac.rolesToCapabilitiesMap = map
    rbac.initialized = true
    return rbac.initialized
  }

  static can (capability: string, ...roles: string[]): boolean {
    if (roles.length === 0) {
      throw Error(`roles parameter is not valid`)
    }
    return some(roles, role => {
      const capabilities = rbac.rolesToCapabilitiesMap.get(role)
      return includes(capabilities, capability)
    })
  }

  static capabilitiesOf (role: string): string[] {
    return rbac.rolesToCapabilitiesMap.get(role) || []
  }

  static listRoles (): string[] {
    return Array.from(rbac.rolesToCapabilitiesMap.keys())
  }

  static get isInitialized (): boolean {
    return rbac.initialized
  }
}

export interface Role {
  name: string,
  capabilities: string[],
  inherits: string[]
}
