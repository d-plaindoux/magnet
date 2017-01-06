/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import coordinator from '../../../lib/actor/core/coordinator';
import localActor from '../../../lib/actor/core/local_actor';

import request from '../../../lib/actor/message/request';
import response from '../../../lib/actor/message/response';

class Test {
    constructor() {
        this.value = 1;
    }
    
    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = value;
    }
    
    receiveRequest(request, response) {
        response.success(request.name());
    }
}

export default  {
  setUp: function(done) {
    done();
  },
    
  'local actor creation': function(test) {
    test.expect(1);    
      
    test.ok(localActor(coordinator(), "test", new Test()), 'should create a local Actor.');      
      
    test.done();
  },
    
  'local actor calling getValue': function(test) {
    test.expect(1);    
    
    var value = 0;
      
    const aLocalActor = localActor(coordinator(), "test", new Test()),
          aResponse = response(v => value = v, _ => null, _ => null);
      
    aLocalActor.askNow(request("getValue",[]), aResponse);
      
    test.equal(value, 1, 'should call immediately a local Actor getValue.');      
      
    test.done();
  },

  'local actor calling setValue and then getValue': function(test) {
    test.expect(1);    
    
    var value = 0;
      
    const aLocalActor = localActor(coordinator(), "test", new Test()),
          aResponse = response(v => value = v, _ => null, _ => null);
      
    aLocalActor.askNow(request("setValue",[2]));
    aLocalActor.askNow(request("getValue",[]), aResponse);
      
    test.equal(value, 2, 'should call immediately a local Actor getValue.');      
      
    test.done();
  },


  'local actor calling undefined method': function(test) {
    test.expect(1);    
    
    var value = 0;
      
    const aLocalActor = localActor(coordinator(), "test", new Test()),
          aResponse = response(v => value = v, _ => null, _ => null);
      
    aLocalActor.askNow(request("testMethod",[]), aResponse);
      
    test.equal(value, "testMethod", 'should call immediately a local Actor getValue.');      
      
    test.done();
  },}
    
    