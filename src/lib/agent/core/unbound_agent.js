/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import objects from "../../utils/objects";

import Agent from "./agent";
import boundAgent from "./bound_agent";

class UnboundAgent extends Agent {
    
    // :: (Coordinator,String) -> Agent
    constructor(coordinator, identifier) {
        super(coordinator, identifier);        
    }
    
    // :: unit -> boolean
    isBound() {
        return false;
    }

    // :: (Request, Response) -> throws EvalError
    askNow(request, response) {
        throw new EvalError("Agent unbound");
    }
    
    // :: 'a -> BoundAgent 'a
    bind(model) {
        var anAgent = boundAgent(this.coordinator, this.identifier, model);
        
        this.coordinator.registerAgent(anAgent);
        
        return anAgent;
    } 
    
    // :: unit -> unit
    unbind() {
        // Nothing to do
    }
}

// :: (Coordinator,String) -> Agent throws ReferenceError
function unboundAgent(coordinator, identifier) {
    objects.requireNonNull(coordinator, "coordinator");
    objects.requireNonNull(identifier, "identifier");

    return new UnboundAgent(coordinator, identifier);
}

export default unboundAgent;
 