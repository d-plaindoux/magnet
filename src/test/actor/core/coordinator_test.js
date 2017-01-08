/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import coordinator from '../../../lib/actor/core/coordinator';

import request from '../../../lib/actor/message/request';
import response from '../../../lib/actor/message/response';

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
}

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
        
  'coordinator can check an existing actor': function(test) {
    test.expect(1);    
      
    const aCoordinator = coordinator();
      
    aCoordinator.actor('test');
      
    test.ok(aCoordinator.hasActor("test"), 'should retreive an actor.');      
      
    test.done();
  },
        
  'coordinator can ask immediately an existing actor': function(test) {
    test.expect(1);    
      
    var value = 0;
      
    const aCoordinator = coordinator(),
          aResponse = response(v => value = v, _ => null, _ => null);
      
    aCoordinator.actor('test').bind(new Test0());
    aCoordinator.askNow('test', request("getValue",[]), aResponse);
        
    test.equal(value, 1, 'should call immediately an test Actor getValue.');      
        
    test.done();
  },
        
  'coordinator cannot ask immediately a disposed unbound actor': function(test) {
    test.expect(1);    
      
    var value = 0;
      
    const aCoordinator = coordinator(),
          aResponse = response(v => null, v => value = v, _ => null);
      
    aCoordinator.actor('test');
    aCoordinator.disposeActor('test');
      
    aCoordinator.askNow('test', request("getValue",[]), aResponse);
       
    test.deepEqual(value, new EvalError("Actor not found"), 'should not call a disposed unbound Actor.');      
    test.done();        
  },
        
  'coordinator cannot ask immediately a disposed bound actor': function(test) {
    test.expect(1);    
      
    var value = 0;
      
    const aCoordinator = coordinator(),
          aResponse = response(v => null, v => value = v, _ => null);
      
    aCoordinator.actor('test').bind(new Test0());
    aCoordinator.disposeActor('test');
      
    aCoordinator.askNow('test', request("getValue",[]), aResponse);
       
    test.deepEqual(value, new EvalError("Actor not found"), 'should not call a disposed bound Actor.');      
    test.done();        
  },
        
  'coordinator cannot ask immediately an inexisting actor': function(test) {
    test.expect(1);    
      
    var value = 0;
      
    const aCoordinator = coordinator(),
          aResponse = response(v => null, v => value = v, _ => null);
      
    aCoordinator.askNow('test', request("getValue",[]), aResponse);
       
    test.deepEqual(value, new EvalError("Actor not found"), 'should not call an Actor unknwon.');      
    test.done();        
  },

  'coordinator can ask an existing actor': function(test) {
    test.expect(1);    
      
    var value = 0;
      
    const aCoordinator = coordinator().start(),
          aResponse = response(v => value = v, _ => null, _ => null);
      
    aCoordinator.actor('test').bind(new Test0()); 
    aCoordinator.ask('test', request("getValue",[]), aResponse);
       
    setTimeout(() => {
        test.equal(value, 1, 'should call a test Actor getValue.');              
        test.done();        
    }, 500);
  },   

  'coordinator can ask an existing actor with preserved ssequence': function(test) {
    test.expect(2);    
      
    var value = 0;
      
    const aCoordinator = coordinator().start(),
          aResponse = response(v => value = v, _ => null, _ => null);
      
    aCoordinator.actor('test').bind(new Test0()); 

    aCoordinator.ask('test', request("getValue",[]), aResponse);
       
    setTimeout(() => {
        test.equal(value, 1, 'should call a test Actor getValue.');              

        aCoordinator.ask('test', request("setValue",[2]));
        aCoordinator.ask('test', request("getValue",[]), aResponse);

        setTimeout(() => {
            test.equal(value, 2, 'should call a test Actor getValue after a set value.');              
            test.done();        
        }, 500);
        
    }, 500);
    
},   
    
  'coordinator can ask an existing actor before starting coordinator': function(test) {
    test.expect(1);    
      
    var value = 0;
      
    const aCoordinator = coordinator(),
          aResponse = response(v => value = v, _ => null, _ => null);
      
    aCoordinator.actor('test').bind(new Test0()); 
    aCoordinator.ask('test', request("getValue",[]), aResponse);
      
    aCoordinator.start();
       
    setTimeout(() => {
        test.equal(value, 1, 'should call a test Actor getValue.');              
        test.done();        
    }, 500);
  },
    
  'coordinator can ask an existing actor before starting coordinator': function(test) {
    test.expect(1);    
      
    var value = 0;
      
    const aCoordinator = coordinator().start(),
          aResponse = response(v => value = v, _ => null, _ => null);
      
    aCoordinator.actor('test').bind(new Test0());   
    aCoordinator.stop();
      
    aCoordinator.ask('test', request("getValue",[]), aResponse);
       
    setTimeout(() => {
        test.equal(value, 0, 'should not call a test Actor getValue when coordinator is not running.');              
        test.done();        
    }, 500);
  },
    
  'coordinator cannot ask an inexisting actor': function(test) {
    test.expect(1);    
      
    var value = 0;
      
    const aCoordinator = coordinator().start(),
          aResponse = response(v => null, v => value = v, _ => null);
      
    aCoordinator.ask('test', request("getValue",[]), aResponse);
       
    setTimeout(() => {
        test.deepEqual(value, new EvalError("Actor not found"), 'should not call an Actor unknwon.');      
        test.done();        
    }, 500);
  },
    
  'coordinator can broadcast an event to all actors': function(test) {
    test.expect(2);    
      
    const aCoordinator = coordinator().start();
      
    aCoordinator.actor('test1').bind(new Test0());   
    aCoordinator.actor('test2').bind(new Test0());   
      
    aCoordinator.broadcast(request("setValue",[2]));
       
    setTimeout(() => {
        test.equal(aCoordinator.actor('test1').model.value, 2, "Should set the test1 actor value");
        test.equal(aCoordinator.actor('test2').model.value, 2, "Should set the test2 actor value");
        test.done();        
    }, 500);
  },

}
    
    