/*
 * Parsec
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import message from '../../../lib/actor/message';

export default  {
  setUp: function(done) {
    done();
  },
    
  'message creation': function(test) {
    test.expect(1);    
      
    var aRequest = message.request("a",[1,2]),
        aResponse = message.response(_ => null, _ => null, _ => null);
      
    test.ok(message.message("123", aRequest, aResponse), 'should create a message.');      
      
    test.done();
  },
    
  'message identifier': function(test) {
    test.expect(1);    
      
    var aRequest = message.request("a",[1,2]),
        aResponse = message.response(_ => null, _ => null, _ => null);
      
    test.equals(message.message("123", aRequest, aResponse).identifier(), "123", 'should retreive the identifier.');      
      
    test.done();
  },
    
  'message request': function(test) {
    test.expect(1);    
      
    var aRequest = message.request("a",[1,2]),
        aResponse = message.response(_ => null, _ => null, _ => null);
      
    test.deepEqual(message.message("123", aRequest, aResponse).request(), aRequest, 'should retreive the request.');      
      
    test.done();
  },
    
  'message response': function(test) {
    test.expect(1);    
      
    var aRequest = message.request("a",[1,2]),
        aResponse = message.response(_ => null, _ => null, _ => null);
      
    test.deepEqual(message.message("123", aRequest, aResponse).response(), aResponse, 'should retreive the response.');      
      
    test.done();
  },
 
}
    
    