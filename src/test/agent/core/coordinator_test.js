/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import coordinator from '../../../lib/agent/core/coordinator';
import response from '../../../lib/agent/core/response_handler';


import reflexive from '../../../lib/agent/foundation/reflexive/reflexive_model';
import request from '../../../lib/agent/foundation/reflexive/reflexive_request';

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
    
  'coordinator cannot check an undefined agent': function(test) {
    test.expect(1);    
      
    test.notEqual(coordinator().hasActor("test"), true, 'should not retreive an agent.');      
      
    test.done();
  },
    
  'coordinator create a fresh agent': function(test) {
    test.expect(1);    
      
    test.ok(coordinator().agent('test'), 'should create a fresh agent.');      
      
    test.done();
  },
    
  'coordinator create a fresh unbound agent': function(test) {
    test.expect(1);    
      
    test.notEqual(coordinator().agent('test').isBound(), true, 'should create an unbound agent.');      
      
    test.done();
  },
        
  'coordinator can check an existing agent': function(test) {
    test.expect(1);    
      
    const aCoordinator = coordinator();
      
    aCoordinator.agent('test');
      
    test.ok(aCoordinator.hasActor("test"), 'should retreive an agent.');      
      
    test.done();
  },
        
  'coordinator can ask immediately an existing agent': function(test) {
    test.expect(1);    
      
    var value = 0;
      
    const aCoordinator = coordinator(),
          aResponse = response(v => value = v, _ => null, _ => null);
      
    aCoordinator.agent('test').bind(reflexive(new Test0()));
    aCoordinator.askNow('test', request("getValue",[]), aResponse);
        
    test.equal(value, 1, 'should call immediately an test Actor getValue.');      
        
    test.done();
  },
        
  'coordinator cannot ask immediately a disposed unbound agent': function(test) {
    test.expect(1);    
      
    var value = 0;
      
    const aCoordinator = coordinator(),
          aResponse = response(v => null, v => value = v, _ => null);
      
    aCoordinator.agent('test');
    aCoordinator.disposeActor('test');
      
    aCoordinator.askNow('test', request("getValue",[]), aResponse);
       
    test.deepEqual(value, new EvalError("Actor not found"), 'should not call a disposed unbound Actor.');      
    test.done();        
  },
        
  'coordinator cannot ask immediately a disposed bound agent': function(test) {
    test.expect(1);    
      
    var value = 0;
      
    const aCoordinator = coordinator(),
          aResponse = response(v => null, v => value = v, _ => null);
      
    aCoordinator.agent('test').bind(reflexive(new Test0()));
    aCoordinator.disposeActor('test');
      
    aCoordinator.askNow('test', request("getValue",[]), aResponse);
       
    test.deepEqual(value, new EvalError("Actor not found"), 'should not call a disposed bound Actor.');      
    test.done();        
  },
        
  'coordinator cannot ask immediately an inexisting agent': function(test) {
    test.expect(1);    
      
    var value = 0;
      
    const aCoordinator = coordinator(),
          aResponse = response(v => null, v => value = v, _ => null);
      
    aCoordinator.askNow('test', request("getValue",[]), aResponse);
       
    test.deepEqual(value, new EvalError("Actor not found"), 'should not call an Actor unknwon.');      
    test.done();        
  },

  'coordinator can ask an existing agent': function(test) {
    test.expect(1);    
      
    var value = 0;
      
    const aCoordinator = coordinator().start(),
          aResponse = response(v => value = v, _ => null, _ => null);
      
    aCoordinator.agent('test').bind(reflexive(new Test0())); 
    aCoordinator.ask('test', request("getValue",[]), aResponse);
       
    setTimeout(() => {
        test.equal(value, 1, 'should call a test Actor getValue.');              
        test.done();        
    }, 500);
  },   

  'coordinator can ask an existing agent with preserved sequence': function(test) {
    test.expect(2);    
      
    var value = 0;
      
    const aCoordinator = coordinator().start(),
          aResponse = response(v => value = v, _ => null, _ => null);
      
    aCoordinator.agent('test').bind(reflexive(new Test0())); 

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
    
  'coordinator can ask an existing agent before started coordinator': function(test) {
    test.expect(1);    
      
    var value = 0;
      
    const aCoordinator = coordinator(),
          aResponse = response(v => value = v, _ => null, _ => null);
      
    aCoordinator.agent('test').bind(reflexive(new Test0())); 
    aCoordinator.ask('test', request("getValue",[]), aResponse);
      
    aCoordinator.start();
       
    setTimeout(() => {
        test.equal(value, 1, 'should call a test Actor getValue.');              
        test.done();        
    }, 500);
  },
    
  'coordinator cannot ask an existing agent before stopped coordinator': function(test) {
    test.expect(1);    
      
    var value = 0;
      
    const aCoordinator = coordinator().start(),
          aResponse = response(v => value = v, _ => null, _ => null);
      
    aCoordinator.agent('test').bind(reflexive(new Test0()));   
    aCoordinator.stop();
      
    aCoordinator.ask('test', request("getValue",[]), aResponse);
       
    setTimeout(() => {
        test.equal(value, 0, 'should not call a test Actor getValue when coordinator is not running.');              
        test.done();        
    }, 500);
  },
    
  'coordinator cannot ask an inexisting agent': function(test) {
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
    
  'coordinator can broadcast an event to all agents': function(test) {
    test.expect(2);    
      
    const aCoordinator = coordinator().start();
      
    aCoordinator.agent('test1').bind(reflexive(new Test0()));   
    aCoordinator.agent('test2').bind(reflexive(new Test0()));   
      
    aCoordinator.broadcast(request("setValue",[2]));
       
    setTimeout(() => {
        test.equal(aCoordinator.agent('test1').model.model.getValue(), 2, "Should set the test1 agent value");
        test.equal(aCoordinator.agent('test2').model.model.getValue(), 2, "Should set the test2 agent value");
        test.done();        
    }, 500);
  },

}
    
    