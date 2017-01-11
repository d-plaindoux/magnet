/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import objects from "../../utils/objects";

import Actor from "./actor";
import boundActor from "./bound_actor";

class UnboundActor extends Actor {
    
    // :: (Coordinator,String) -> Actor
    constructor(coordinator, identifier) {
        super(coordinator, identifier);        
    }
    
    // :: unit -> boolean
    isBound() {
        return false;
    }

    // :: (Request, Response) -> throws EvalError
    askNow(request, response) {
        throw new EvalError("Actor unbound");
    }
    
    // :: 'a -> BoundActor 'a
    bind(model) {
        var anActor = boundActor(this.coordinator, this.identifier, model);
        
        this.coordinator.registerActor(anActor);
        
        return anActor;
    } 
    
    // :: unit -> unit
    unbind() {
        // Nothing to do
    }
}

// :: (Coordinator,String) -> Actor throws ReferenceError
function unboundActor(coordinator, identifier) {
    objects.requireNonNull(coordinator, "coordinator");
    objects.requireNonNull(identifier, "identifier");

    return new UnboundActor(coordinator, identifier);
}

export default unboundActor;
 