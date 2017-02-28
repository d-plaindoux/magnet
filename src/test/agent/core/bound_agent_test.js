/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import coordinator from '../../../lib/agent/core/coordinator';
import boundAgent from '../../../lib/agent/core/bound_agent';
import response from '../../../lib/agent/core/response_handler';

import reflexive from '../../../lib/agent/foundation/reflexive/reflexive_model';
import request from '../../../lib/agent/foundation/reflexive/reflexive_request';

class Test0 {
    constructor() {
        this.value = 1;
    }
    
    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = value;
    }
}

class Test1 {
    accept(request, response) {
        response.success(request.name());
    }
}

class Test2 {
    testError() {
        throw new EvalError("Boom");
    }
}

export default  {
  setUp: function(done) {
    done();
  },
    
  'bound agent rejected': function(test) {
    test.expect(1);    
      
    test.throws(() => boundAgent(coordinator(), "test", new Test0()), TypeError, 'should new bound Agent.');      
      
    test.done();
  },
    
  'bound agent creation': function(test) {
    test.expect(1);    
      
    test.ok(boundAgent(coordinator(), "test", reflexive(new Test0())), 'should create a bound Agent.');      
      
    test.done();
  },
    
  'bound agent cannot be bound twice': function(test) {
    test.expect(1);    
      
    const anAgent = boundAgent(coordinator(), "test", reflexive(new Test0()));

    test.throws(() => anAgent.bind(1), EvalError, 'should bind twice an Agent.');      
      
    test.done();
  },
    
  'bound agent is bound': function(test) {
    test.expect(1);    
      
    test.ok(boundAgent(coordinator(), "test", reflexive(new Test0())).isBound(), 'should create a bound Agent.');      
      
    test.done();
  },
    
  'bound agent calling getValue': function(test) {
    test.expect(1);    
    
    var value = 0;
      
    const aBoundAgent = boundAgent(coordinator(), "test", reflexive(new Test0())),
          aResponse = response(v => value = v, _ => null, _ => null);
      
    aBoundAgent.askNow(request("getValue",[]), aResponse);
      
    test.equal(value, 1, 'should call immediately a bound Agent getValue.');      
      
    test.done();
  },

  'bound agent calling setValue and then getValue': function(test) {
    test.expect(1);    
    
    var value = 0;
      
    const aBoundAgent = boundAgent(coordinator(), "test", reflexive(new Test0())),
          aResponse = response(v => value = v, _ => null, _ => null);
      
    aBoundAgent.askNow(request("setValue",[2]));
    aBoundAgent.askNow(request("getValue",[]), aResponse);
      
    test.equal(value, 2, 'should call immediately a bound Agent getValue.');      
      
    test.done();
  },

  'bound simple agent calling method succeed': function(test) {
    test.expect(1);    
    
    var value = 0;
      
    const aBoundAgent = boundAgent(coordinator(), "test", new Test1()),
          aResponse = response(v => value = v, _ => null, _ => null);
      
    aBoundAgent.askNow(request("testMethod",[]), aResponse);
      
    test.equal(value, "testMethod", 'should call immediately a bound Agent unkown method.');      
      
    test.done();
  },

  'bound agent calling method throwing an error': function(test) {
    test.expect(1);    
    
    var value = 0;
      
    const aBoundAgent = boundAgent(coordinator(), "test", reflexive(new Test2())),
          aResponse = response(_ => null, v => value = v, _ => null);
      
    aBoundAgent.askNow(request("testError",[]), aResponse);
      
    test.deepEqual(value, new EvalError("Boom"), 'should call immediately a bound Agent method.');      
      
    test.done();
  },
    
  'bound agent calling transitive method': function(test) {
    test.expect(1);    
    
    var value = 0;
      
    const aBoundAgent = boundAgent(coordinator(), "test", reflexive(new Test1())),
          aResponse = response(v => value = v, _ => null, _ => null);
      
    aBoundAgent.askNow(request("testMethod",[]), aResponse);
      
    test.equal(value, "testMethod", 'should call immediately a bound Agent unkown method.');      
      
    test.done();
  },
    
  'bound agent calling undefined method fails': function(test) {
    test.expect(1);    
    
    var value = 0;
      
    const aLocalAgent = boundAgent(coordinator(), "test", reflexive(new Test0())),
          aResponse = response(v => null, v => value = v, _ => null);
      
    aLocalAgent.askNow(request("testMethod",[]), aResponse);
      
    test.deepEqual(value, new EvalError("Agent behavior not found"), 'should not call immediately a bound Agent unknwon method.');      
      
    test.done();
  },
    
    
  'bound agent with function': function(test) {
    test.expect(1);    
    
    var value = 0;
      
    const aFunction = (request, response) => response.success(request),
          aBoundAgent = boundAgent(coordinator(), "test", aFunction),
          aResponse = response(v => value = v, _ => null, _ => null);
      
    aBoundAgent.askNow(2, aResponse);
      
    test.equal(value, 2, 'should call immediately a bound function.');      
      
    test.done();
  },

}
    
    