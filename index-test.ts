// @ts-check
// @TODO: should we try a global installation of ts-node? and execue only `ts-node tests`?
// we should also say to typescript to not compile files that end with -test.ts...
// const test = require('tape')
import * as test from 'tape'
import {rbac} from './index'

test('rbac system is not initialized', assert => {
  assert.false(rbac.isInitialized, 'rbac system is not intialized')
  assert.end()
})

test('Init the rbac system', assert => {
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
      permissions: ['comment:read', 'post:edit', 'comment:edit'],
      inherits: ['VIEWER']
    },
    {
      name: 'USER_MANAGER',
      permissions: ['user:read', 'user:edit'],
      inherits: []
    }
  ]

  rbac.init(rolesData)
  assert.true(rbac.isInitialized, 'rbac system intialized')
  assert.end()
})

test('rbac system is already initialized', assert => {
  assert.true(rbac.isInitialized, 'rbac system already initialized')
  assert.end()
})

test('can method should throw error if no role is given', assert => {
  try {
    rbac.can('post:read')
  } catch (err) {
    assert.end()
  }
})

test('UNKNOWN_ROLE should not be able to do anything', assert => {
  assert.false(rbac.can('post:read', 'UNKNOWN_ROLE'))
  assert.end()
})

test('VIEWER can read posts', assert => {
  assert.true(rbac.can('post:read', 'VIEWER'))
  assert.end()
})

test('EDITOR can read posts (inherited from VIEWER)', assert => {
  assert.true(rbac.can('post:read', 'EDITOR'))
  assert.end()
})

test('VIEWER can not edit posts', assert => {
  assert.false(rbac.can('post:edit', 'VIEWER'))
  assert.end()
})

test('EDITOR can edit posts', assert => {
  assert.true(rbac.can('post:edit', 'EDITOR'))
  assert.end()
})

test('the operation is tested against multiple roles (found in the second role)', assert => {
  assert.true(rbac.can('post:edit', 'VIEWER', 'EDITOR'))
  assert.end()
})

test('the operation is tested against multiple roles (found in the first role)', assert => {
  assert.true(rbac.can('post:read', 'VIEWER', 'EDITOR'))
  assert.end()
})

test('the operation is tested against multiple roles (not present)', assert => {
  assert.false(rbac.can('iDo:NotExist', 'VIEWER', 'EDITOR'))
  assert.end()
})

test('list all capabilities of VIEWER', assert => {
  const capabilities = rbac.capabilitiesOf('VIEWER')
  assert.true(capabilities)
  assert.true(capabilities.length === 2)
  assert.end()
})

test('list all capabilities of EDITOR (it inherits from VIEWER)', assert => {
  const capabilities = rbac.capabilitiesOf('EDITOR')
  assert.true(capabilities)
  assert.true(capabilities.length === 4)
  assert.end()
})

test('list all capabilities of DISABLED', assert => {
  const capabilities = rbac.capabilitiesOf('DISABLED')
  assert.true(capabilities)
  assert.true(capabilities.length === 0)
  assert.end()
})

test('UNKNOWN_ROLE should return undefined', assert => {
  const capabilities = rbac.capabilitiesOf('UNKNOWN_ROLE')
  assert.true(capabilities)
  assert.true(capabilities.length === 0)
  assert.end()
})

test('list all the roles', assert => {
  const roles = rbac.listRoles()
  assert.true(roles)
  assert.true(roles.length === 4)
  assert.end()
})
