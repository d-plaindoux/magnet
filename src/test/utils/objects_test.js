/*
 * Parsec
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import objects from '../../lib/utils/objects';

export default  {
  setUp: function(done) {
    done();
  },
    
  'Require non null succeed': function(test) {
    test.expect(1);    
      
    test.ok(objects.requireNonNull(1), 'should not be null.');      
      
    test.done();
  },
    
  'Require null failed': function(test) {
    test.expect(1);    
      
    test.throws(() => objects.requireNonNull(null), ReferenceError, 'should not be null.');      
      
    test.done();
  },
    
}
    
    