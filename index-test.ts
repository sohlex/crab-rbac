// @ts-check
// @TODO: should we try a global installation of ts-node? and execue only `ts-node tests`?
// we should also say to typescript to not compile files that end with -test.ts...
// const test = require('tape')
import * as test from 'tape'
import Rbac from './index'

test('Rbac system is not initialized', assert => {
  assert.false(Rbac.isInitialized, 'Rbac system is not intialized')
  assert.end()
})

test('Init the Rbac system', assert => {
  const rolesData = [
    {
      name: 'DISABLED',
      permissions: [],
      inherits: []
    },
    {
      name: 'VIEWER',
      permissions: ['post:read', 'comment:read'],
      inherits: []
    },
    {
      name: 'EDITOR',
      permissions: ['post:edit', 'comment:edit'],
      inherits: ['VIEWER']
    },
    {
      name: 'USER_MANAGER',
      permissions: ['user:read', 'user:edit'],
      inherits: []
    }
  ]

  Rbac.init(rolesData)
  assert.true(Rbac.isInitialized, 'Rbac system intialized')
  assert.end()
})

test('Rbac system is already initialized', assert => {
  assert.true(Rbac.isInitialized, 'Rbac system already initialized')
  assert.end()
})

test('can method should throw error if no role is given', assert => {
  try {
    Rbac.can('post:read')
  } catch (err) {
    assert.end()
  }
})

test('UNKNOWN_ROLE should not be able to do anything', assert => {
  assert.false(Rbac.can('post:read', 'UNKNOWN_ROLE'))
  assert.end()
})

test('VIEWER can read posts', assert => {
  assert.true(Rbac.can('post:read', 'VIEWER'))
  assert.end()
})

test('EDITOR can read posts (inherited from VIEWER)', assert => {
  assert.true(Rbac.can('post:read', 'EDITOR'))
  assert.end()
})

test('VIEWER can not edit posts', assert => {
  assert.false(Rbac.can('post:edit', 'VIEWER'))
  assert.end()
})

test('EDITOR can edit posts', assert => {
  assert.true(Rbac.can('post:edit', 'EDITOR'))
  assert.end()
})

test('the operation is tested against multiple roles (found in the second role)', assert => {
  assert.true(Rbac.can('post:edit', 'VIEWER', 'EDITOR'))
  assert.end()
})

test('the operation is tested against multiple roles (found in the first role)', assert => {
  assert.true(Rbac.can('post:read', 'VIEWER', 'EDITOR'))
  assert.end()
})

test('the operation is tested against multiple roles (not present)', assert => {
  assert.false(Rbac.can('iDo:NotExist', 'VIEWER', 'EDITOR'))
  assert.end()
})

test('list all capabilities of VIEWER', assert => {
  const capabilities = Rbac.capabilitiesOf('VIEWER')
  assert.true(capabilities)
  assert.true(capabilities.length === 2)
  assert.end()
})

test('list all capabilities of EDITOR (it inherits from VIEWER)', assert => {
  const capabilities = Rbac.capabilitiesOf('EDITOR')
  assert.true(capabilities)
  assert.true(capabilities.length === 4)
  assert.end()
})

test('list all capabilities of DISABLED', assert => {
  const capabilities = Rbac.capabilitiesOf('DISABLED')
  assert.true(capabilities)
  assert.true(capabilities.length === 0)
  assert.end()
})

test('UNKNOWN_ROLE should return undefined', assert => {
  const capabilities = Rbac.capabilitiesOf('UNKNOWN_ROLE')
  assert.true(capabilities)
  assert.true(capabilities.length === 0)
  assert.end()
})

test('list all the roles', assert => {
  const roles = Rbac.listRoles()
  assert.true(roles)
  assert.true(roles.length === 4)
  assert.end()
})
