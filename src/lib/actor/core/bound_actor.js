/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import objects from "../../utils/objects";

import Actor from "./actor";

class BoundActor extends Actor {
    
    // :: (Coordinator,String,'a) -> BoundActor 'a
    constructor(coordinator, identifier, model) {
        super(coordinator, identifier);       
        
        this.model = model;
    }
    
    // :: unit -> boolean
    isBound() {
        return true;
    }
    
    // :: (Request,Response?) -> unit
    askNow(request, response) {
        try {
            if (this.model[request.name()]) {
                const method = this.model[request.name()];                
                const result = method.apply(this.model, request.parameters());
            
                if (response) {
                    response.success(result);
                }
            } else if (this.model.receiveRequest) {
                this.model.receiveRequest(request, response);
            } else {                
                throw new EvalError("Actor behavior not found");
            }
        } catch (error) {
            if (response) {
                response.failure(error);
            }
        }
    }
        
    // :: 'a -> throws EvalError
    bind(model) {
        throw new EvalError("Actor already bound");
    }

    // :: unit -> unit
    unbind() {
        if (this.model.unboundAsActor) {
            this.model.unboundAsActor();
        }
    }
}

// :: (Coordinator,String,'a) -> BoundActor 'a throws ReferenceError
function boundActor(coordinator, identifier, model) {
    objects.requireNonNull(coordinator, "coordinator");
    objects.requireNonNull(identifier, "identifier");
    objects.requireNonNull(model, "model");
    
    return new BoundActor(coordinator, identifier, model);
}

export default boundActor;
 