/*
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

  'coordinator can ask an existing agent X times': function(test) {
    var numberOfCall = 100;

    test.expect(numberOfCall);

    var values = Array(numberOfCall);

    const aCoordinator = coordinator().start();

    aCoordinator.agent('test').bind(reflexive(new Test0()));

    for(var i = 0; i < numberOfCall; i++) {
        const j = i, aResponse = response(v => values[j] = v, _ => null, _ => null);
        aCoordinator.ask('test', request("getValue",[]), aResponse);
    }

    setTimeout(() => {
        for(var i = 0; i < numberOfCall; i++) {
            test.equal(values[i], 1, 'should call a test Agent ' + i + ' getValue.');
        }
        test.done();
    }, 1000);
  },

  'coordinator can ask existing X agent one time': function(test) {
    var numberOfCall = 100;

    test.expect(numberOfCall);

    var values = Array(numberOfCall);

    const aCoordinator = coordinator().start();

    for(var i = 0; i < numberOfCall; i++) {
        const j = i, aResponse = response(v => values[j] = v, _ => null, _ => null);
        aCoordinator.agent('test' + i).bind(reflexive(new Test0()));
        aCoordinator.ask('test' + i, request("getValue",[]), aResponse);
    }

    setTimeout(() => {
        for(var i = 0; i < numberOfCall; i++) {
            test.equal(values[i], 1, 'should call a test Agent number ' + i + ' getValue.');
        }
        test.done();
    }, 1000);
  },
}
