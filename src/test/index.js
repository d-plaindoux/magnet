/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import objectsTest from './utils/objects_test';

import responseTest from './agent/core/response_handler_test';

import requestTest from './agent/core/reflexive_request_test';

import agentTest from './agent/core/agent_test'
import boundActorTest from './agent/core/bound_agent_test'
import unboundActorTest from './agent/core/unbound_agent_test'

import coordinatorTest from './agent/core/coordinator_test'

export {
    objectsTest,        
    
    responseTest,         

    requestTest,
    
    agentTest,
    boundActorTest,
    unboundActorTest,
        
    coordinatorTest        
}