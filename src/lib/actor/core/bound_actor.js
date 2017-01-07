/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import Actor from "./actor";

class /*abstract*/ BoundActor extends Actor {
    
    constructor(coordinator, identifier) {
        if (new.target === BoundActor) {
            throw new TypeError("Abstract class");
        }

        super(coordinator, identifier);        
    }
    
    isBound() {
        return true;
    }

    bind(model) {
        throw new EvalError("Actor already bound");
    }    
}

export default BoundActor;
 