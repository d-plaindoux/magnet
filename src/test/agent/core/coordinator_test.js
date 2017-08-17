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

    unboundAsAgent() {
        this.value = -1;
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

    test.notEqual(coordinator().hasAgent("test"), true, 'should not retreive an agent.');

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

    test.ok(aCoordinator.hasAgent("test"), 'should retreive an agent.');

    test.done();
  },

  'coordinator can ask immediately an existing agent': function(test) {
    test.expect(1);

    var value = 0;

    const aCoordinator = coordinator(),
          aResponse = response(v => value = v, _ => null, _ => null);

    aCoordinator.agent('test').bind(reflexive(new Test0()));
    aCoordinator.askNow('test', request("getValue",[]), aResponse);

    test.equal(value, 1, 'should call immediately an test Agent getValue.');

    test.done();
  },

  'coordinator cannot ask immediately a disposed unbound agent': function(test) {
    test.expect(1);

    var value = 0;

    const aCoordinator = coordinator(),
          aResponse = response(v => null, v => value = v, _ => null);

    aCoordinator.agent('test');
    aCoordinator.dispose('test');

    aCoordinator.askNow('test', request("getValue",[]), aResponse);

    test.deepEqual(value, new EvalError("Agent not found"), 'should not call a disposed unbound Agent.');
    test.done();
  },

  'coordinator cannot ask immediately a disposed bound agent': function(test) {
    test.expect(1);

    var value = 0;

    const aCoordinator = coordinator(),
          aResponse = response(v => null, v => value = v, _ => null);

    aCoordinator.agent('test').bind(reflexive(new Test0()));
    aCoordinator.dispose('test');

    aCoordinator.askNow('test', request("getValue",[]), aResponse);

    test.deepEqual(value, new EvalError("Agent not found"), 'should not call a disposed bound Agent.');
    test.done();
  },

  'coordinator cannot ask immediately an inexisting agent': function(test) {
    test.expect(1);

    var value = 0;

    const aCoordinator = coordinator(),
          aResponse = response(v => null, v => value = v, _ => null);

    aCoordinator.askNow('test', request("getValue",[]), aResponse);

    test.deepEqual(value, new EvalError("Agent not found"), 'should not call an Agent unknwon.');
    test.done();
  },

  'coordinator can ask an existing agent': function(test) {
    test.expect(1);

    var value = 0;

    const aCoordinator = coordinator().start(),
          aResponse = response(v => value = v, _ => null, _ => null);

    aCoordinator.agent('test').bind(reflexive(new Test0()));
    aResponse.bind(aCoordinator.ask('test', request("getValue",[])));

    setTimeout(() => {
        test.equal(value, 1, 'should call a test Agent getValue.');
        test.done();
    }, 500);
  },

  'coordinator can ask an existing agent with preserved sequence': function(test) {
    test.expect(2);

    var value = 0;

    const aCoordinator = coordinator().start(),
          aResponse = response(v => value = v, _ => null, _ => null);

    aCoordinator.agent('test').bind(reflexive(new Test0()));
    aResponse.bind(aCoordinator.ask('test', request("getValue",[])));

    setTimeout(() => {
        test.equal(value, 1, 'should call a test Agent getValue.');

        aCoordinator.ask('test', request("setValue",[2]));
        aResponse.bind(aCoordinator.ask('test', request("getValue",[])));

        setTimeout(() => {
            test.equal(value, 2, 'should call a test Agent getValue after a set value.');
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
    aResponse.bind(aCoordinator.ask('test', request("getValue",[])));

    aCoordinator.start();

    setTimeout(() => {
        test.equal(value, 1, 'should call a test Agent getValue.');
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

    aResponse.bind(aCoordinator.ask('test', request("getValue",[])));

    setTimeout(() => {
        test.equal(value, 0, 'should not call a test Agent getValue when coordinator is not running.');
        test.done();
    }, 500);
  },

  'coordinator cannot ask an inexisting agent': function(test) {
    test.expect(1);

    var value = 0;

    const aCoordinator = coordinator().start(),
          aResponse = response(v => null, v => value = v, _ => null);

    aResponse.bind(aCoordinator.ask('test', request("getValue",[])));

    setTimeout(() => {
        test.deepEqual(value, new EvalError("Agent not found"), 'should not call an Agent unknwon.');
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

  'coordinator can unbound an existing agent': function(test) {
    test.expect(1);

    var value = 0;

    const aCoordinator = coordinator(),
          aTestModel = new Test0();

    aCoordinator.agent('test').bind(reflexive(aTestModel));
    aCoordinator.dispose('test');

    test.equal(aTestModel.value, -1, 'should call immediately an test Agent getValue.');
    test.done();
  },

  'coordinator can dispose a bound agent': function(test) {
    test.expect(1);

    var value = 0;

    const aCoordinator = coordinator(),
            aTestModel = new Test0();

    aCoordinator.agent('test').bind(reflexive(aTestModel)).dispose();

    test.equal(aTestModel.value, -1, 'should call immediately an test Agent getValue.');
    test.done();
  },
}
