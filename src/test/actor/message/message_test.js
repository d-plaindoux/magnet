/*
 * Parsec
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import message from '../../../lib/actor/message/message';
import request from '../../../lib/actor/message/request';
import response from '../../../lib/actor/message/response';

export default  {
  setUp: function(done) {
    done();
  },
    
  'message creation': function(test) {
    test.expect(1);    
      
    var aRequest = request("a",[1,2]),
        aResponse = response(_ => null, _ => null, _ => null);
      
    test.ok(message("123",request, response), 'should create a message.');      
      
    test.done();
  },
    
  'message identifier': function(test) {
    test.expect(1);    
      
    var aRequest = request("a",[1,2]),
        aResponse = response(_ => null, _ => null, _ => null);
      
    test.equals(message("123", aRequest, aResponse).identifier(), "123", 'should retreive the identifier.');      
      
    test.done();
  },
    
  'message request': function(test) {
    test.expect(1);    
      
    var aRequest = request("a",[1,2]),
        aResponse = response(_ => null, _ => null, _ => null);
      
    test.deepEqual(message("123", aRequest, aResponse).request(), aRequest, 'should retreive the request.');      
      
    test.done();
  },
    
  'message response': function(test) {
    test.expect(1);    
      
    var aRequest = request("a",[1,2]),
        aResponse = response(_ => null, _ => null, _ => null);
      
    test.deepEqual(message("123", aRequest, aResponse).response(), aResponse, 'should retreive the response.');      
      
    test.done();
  },
 
}
    
    