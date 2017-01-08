/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import Actor from "./actor";
import boundActor from "./bound_actor";

class UnboundActor extends Actor {
    
    constructor(coordinator, identifier) {
        super(coordinator, identifier);        
    }
    
    isBound() {
        return false;
    }

    askNow(request, response) {
        throw new EvalError("Actor unbound");
    }
    
    bind(model) {
        var anActor = boundActor(this.coordinator, this.identifier, model);
        this.coordinator.registerActor(anActor);
        
        if (model.boundAsActor) {
            model.boundAsActor();
        }

        return anActor;
    } 
    
    unbind() {
        // Nothing to do
    }
}

function unboundActor(coordinator, identifier) {
    return new UnboundActor(coordinator, identifier);
}

export default unboundActor;
 