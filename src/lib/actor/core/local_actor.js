/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */


import BoundActor from "./bound_actor";
import objects from "../../utils/objects";

class LocalActor extends BoundActor {
    
    constructor(coordinator, identifier, model) {
        super(coordinator, identifier);       
        
        this.model = model;
    }
    
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
            } else {
                throw error;
            }
        }
    }
       
}

function localActor(coordinator, identifier, model) {
    objects.requireNonNull(coordinator, "coordinator");
    objects.requireNonNull(identifier, "identifier");
    objects.requireNonNull(model, "model");
    
    return new LocalActor(coordinator, identifier, model);
}

export default localActor;
 