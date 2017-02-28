/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import Agent from '../../../lib/agent/core/agent';

export default  {
  setUp: function(done) {
    done();
  },
    
  'Cannot create an Agent instance': function(test) {
    test.expect(1);    
      
    test.throws(() => new Agent(null, null), TypeError, 'should not create an instance.');      
      
    test.done();
  },
    
  'Cannot create an Agent instance': function(test) {
    test.expect(1);    
      
    test.throws(() => new Agent(null, null), TypeError, 'should not create an instance.');      
      
    test.done();
  },

}
    
    