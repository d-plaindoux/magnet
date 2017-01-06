/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import response from '../../../lib/actor/message/response';

export default  {
  setUp: function(done) {
    done();
  },
    
  'response creation': function(test) {
    test.expect(1);    
      
    test.ok(response(_ => null, _ => null, _ => null), 'should create a response.');      
      
    test.done();
  },
    
  'response success': function(test) {
    test.expect(1);
      
    var value = 0;      
    response(v => value = v, _ => null, _ => null).success(1);            
    test.equals(value, 1, 'should call response success.');      
      
    test.done();
  },
    
  'response failure': function(test) {
    test.expect(1);
      
    var value = 0;      
    response(_ => null, v => value = v, _ => null).failure(1);            
    test.equals(value, 1, 'should call response failure.');      
      
    test.done();
  },
    
  'response timeout': function(test) {
    test.expect(1);
      
    var value = 0;      
    response(_ => null, _ => null, v => value = 1).timeout();            
    test.equals(value, 1, 'should call response failure.');      
      
    test.done();
  }
}
    
    