debug = require('debug')('spec-integration:customers')
_ = require 'underscore'
_.mixin require 'underscore-mixins'
Promise = require 'bluebird'
{SphereClient} = require '../../lib/main'
Config = require('../../config').config

uniqueId = (prefix) ->
  _.uniqueId "#{prefix}#{new Date().getTime()}_"

describe 'Integration Customers', ->

  beforeEach (done) ->
    @client = new SphereClient config: Config
    debug 'About to delete all customers'
    @client.customers.process (payload) =>
      debug "Deleting #{payload.body.total} customers"
      Promise.map payload.body.results, (customer) =>
        @client.customers.byId(customer.id).delete(customer.version)
    .then (results) ->
      debug "Deleted #{results.length} customers"
      done()
    .catch (error) -> done(_.prettify(error))
  , 10000 # 10 sec

  it 'should update descriptions with process', (done) ->
    customer =
      email: "someone+#{uniqueId()}@example.com"
      firstName: 'Some'
      lastName: 'One'
      password: 'TopSecret'
    @client.customers.create customer
    .then (results) =>
      expect(results.statusCode).toBe 201
      @client.customers.login
        email: customer.email
        password: customer.password
      .then (result) =>
        expect(result.statusCode).toBe 200
      done()
    .catch (error) -> done(_.prettify(error))
  , 10000 # 10 sec
