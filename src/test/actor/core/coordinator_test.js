/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import coordinator from '../../../lib/actor/core/coordinator';

export default  {
  setUp: function(done) {
    done();
  },
    
  'coordinator creation': function(test) {
    test.expect(1);    
      
    test.ok(coordinator(), 'should create a request.');      
      
    test.done();
  },
    
  'coordinator cannot check an undefined actor': function(test) {
    test.expect(1);    
      
    test.notEqual(coordinator().hasActor("test"), true, 'should not retreive an actor.');      
      
    test.done();
  },
    
  'coordinator create a fresh actor': function(test) {
    test.expect(1);    
      
    test.ok(coordinator().actor('test'), 'should create a fresh actor.');      
      
    test.done();
  },
    
  'coordinator create a fresh unbound actor': function(test) {
    test.expect(1);    
      
    test.notEqual(coordinator().actor('test').isBound(), true, 'should create an unbound actor.');      
      
    test.done();
  },
        
  'coordinator can check an defined actor': function(test) {
    test.expect(1);    
      
    const aCoordinator = coordinator();
      
    aCoordinator.actor('test');
      
    test.ok(aCoordinator.hasActor("test"), 'should retreive an actor.');      
      
    test.done();
  },

}
    
    