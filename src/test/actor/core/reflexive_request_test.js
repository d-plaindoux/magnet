/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import request from '../../../lib/actor/foundation/reflexive_request';

export default  {
  setUp: function(done) {
    done();
  },
    
  'request creation': function(test) {
    test.expect(1);    
      
    test.ok(request("a",[]), 'should create a request.');      
      
    test.done();
  },
    
  'request name': function(test) {
    test.expect(1);
      
    test.equal(request("a",[]).name(), "a", 'should retrieve request name.');      
      
    test.done();
  },

  'request parameters': function(test) {
    test.expect(1);
      
    test.deepEqual(request("a",[1,2]).parameters(), [1,2], 'should retrieve request parameters.');      
      
    test.done();
  },
 
}
    
    