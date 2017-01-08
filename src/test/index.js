/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import objectsTest from './utils/objects_test';

import responseTest from './actor/message/response_test';
import requestTest from './actor/message/request_test';

import localActorTest from './actor/core/local_actor_test'
import unboundActorTest from './actor/core/unbound_actor_test'

import coordinatorTest from './actor/core/coordinator_test'

export {
    objectsTest,        
    
    responseTest, 
    requestTest,
    
    localActorTest,
    unboundActorTest,
        
    coordinatorTest
        
}