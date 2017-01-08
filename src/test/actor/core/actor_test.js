/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import Actor from '../../../lib/actor/core/actor';

export default  {
  setUp: function(done) {
    done();
  },
    
  'Cannot create an Actor instance': function(test) {
    test.expect(1);    
      
    test.throws(() => new Actor(null, null), TypeError, 'should not create an instance.');      
      
    test.done();
  },

}
    
    