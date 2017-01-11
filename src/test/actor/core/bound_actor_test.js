/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import coordinator from '../../../lib/actor/core/coordinator';
import boundActor from '../../../lib/actor/core/bound_actor';

import request from '../../../lib/actor/message/request';
import response from '../../../lib/actor/message/response';

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

class Test1 extends Test0 {
    constructor() {
        super();
    }

    receiveRequest(request, response) {
        response.success(request.name());
    }
}

export default  {
  setUp: function(done) {
    done();
  },
    
  'bound actor creation': function(test) {
    test.expect(1);    
      
    test.ok(boundActor(coordinator(), "test", new Test0()), 'should create a bound Actor.');      
      
    test.done();
  },
    
  'bound actor cannot be bound twice': function(test) {
    test.expect(1);    
      
    const anActor = boundActor(coordinator(), "test", new Test0());

    test.throws(() => anActor.bind(1), EvalError, 'should bind twice an Actor.');      
      
    test.done();
  },
    
  'bound actor is bound': function(test) {
    test.expect(1);    
      
    test.ok(boundActor(coordinator(), "test", new Test0()).isBound(), 'should create a bound Actor.');      
      
    test.done();
  },
    
  'bound actor calling getValue': function(test) {
    test.expect(1);    
    
    var value = 0;
      
    const aBoundActor = boundActor(coordinator(), "test", new Test0()),
          aResponse = response(v => value = v, _ => null, _ => null);
      
    aBoundActor.askNow(request("getValue",[]), aResponse);
      
    test.equal(value, 1, 'should call immediately a bound Actor getValue.');      
      
    test.done();
  },

  'bound actor calling setValue and then getValue': function(test) {
    test.expect(1);    
    
    var value = 0;
      
    const aBoundActor = boundActor(coordinator(), "test", new Test0()),
          aResponse = response(v => value = v, _ => null, _ => null);
      
    aBoundActor.askNow(request("setValue",[2]));
    aBoundActor.askNow(request("getValue",[]), aResponse);
      
    test.equal(value, 2, 'should call immediately a bound Actor getValue.');      
      
    test.done();
  },

  'bound actor calling undefined method succeed': function(test) {
    test.expect(1);    
    
    var value = 0;
      
    const aBoundActor = boundActor(coordinator(), "test", new Test1()),
          aResponse = response(v => value = v, _ => null, _ => null);
      
    aBoundActor.askNow(request("testMethod",[]), aResponse);
      
    test.equal(value, "testMethod", 'should call immediately a bound Actor unkown method.');      
      
    test.done();
  },

  'bound actor calling undefined method fails': function(test) {
    test.expect(1);    
    
    var value = 0;
      
    const aLocalActor = boundActor(coordinator(), "test", new Test0()),
          aResponse = response(v => null, v => value = v, _ => null);
      
    aLocalActor.askNow(request("testMethod",[]), aResponse);
      
    test.deepEqual(value, new EvalError("Actor behavior not found"), 'should not call immediately a bound Actor unknwon method.');      
      
    test.done();
  },
    
    
  'bound actor with function': function(test) {
    test.expect(1);    
    
    var value = 0;
      
    const aFunction = (request, response) => response.success(request),
          aBoundActor = boundActor(coordinator(), "test", aFunction),
          aResponse = response(v => value = v, _ => null, _ => null);
      
    aBoundActor.askNow(2, aResponse);
      
    test.equal(value, 2, 'should call immediately a bound function.');      
      
    test.done();
  },

}
    
    