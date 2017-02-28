/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import objects from "../../utils/objects";

import functionalModel from "../foundation/functional/functional_model";

import Actor from "./agent";

class BoundActor extends Actor {
    
    // :: (Coordinator,String,'a) -> BoundActor 'a
    constructor(coordinator, identifier, model) {
        super(coordinator, identifier);       
        
        this.model = this.handleModel(model);
        
        if (this.model.boundAsActor) {
            this.model.boundAsActor(this.coordinator, this);
        }
    }
    
    // :: unit -> boolean
    isBound() {
        return true;
    }
    
    // :: (Request,Response?) -> unit
    askNow(request, response) {
        try {
            this.model.accept(request, response);
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
       
    // :: Any -> Model
    handleModel(model) {
        if (typeof model === "function") {
            return functionalModel(model);
        }
        
        if (model.accept) {
            return model;
        }
        
        
        throw new TypeError("Must implement [accept] method");
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
 