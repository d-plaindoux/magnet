/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import coordinator from '../../../lib/agent/core/coordinator';
import unboundAgent from '../../../lib/agent/core/unbound_agent';
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
    
    boundAsAgent() {
        // nothing
    }
}

export default  {
  setUp: function(done) {
    done();
  },
    
  'unbound agent creation': function(test) {
    test.expect(1);    
      
    test.ok(unboundAgent(coordinator(), "test"), 'should create an unbound Agent.');      
      
    test.done();
  },
        
  'unbound agent is not bound': function(test) {
    test.expect(1);    
      
    test.equal(unboundAgent(coordinator(), "test").isBound(), false, 'should create an unbound Agent.');      
      
    test.done();
  },
        
  'unbound agent cannot be asked': function(test) {
    test.expect(1);    
      
    const anUnboundAgent = unboundAgent(coordinator(), "test"),
          aResponse = response(v => value = v, _ => null, _ => null);
      
    test.throws(() => anUnboundAgent.askNow(request("getValue",[]), aResponse), EvalError, "should not call immediately getValue");
      
    test.done();
  },
        
  'unbound agent can be bound': function(test) {
    test.expect(1);    
      
    const anUnboundAgent = unboundAgent(coordinator(), "test"),
          aResponse = response(v => value = v, _ => null, _ => null);
      
    test.ok(anUnboundAgent.bind(reflexive(new Test0())).isBound(), EvalError, "should bind an unbound agent");
      
    test.done();
  },

}
