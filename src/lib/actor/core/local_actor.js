/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import BoundActor from "./bound_actor";

class LocalActor extends BoundActor {
    
    constructor(coordinator, identifier) {
        super(coordinator, identifier);        
    }
    
    askNow(request, response) {
        try {
            const method = this.model[request.getName()];

            if (method) {
                const result = method.apply(this.model, request.getParameters());
            
                if (response) {
                    response.success(result);
                }
            } else if (this.model.receiveRequest) {
                this.model.receiveRequest(request, response);
            } else {
                throw new EvalError("Actor entry not found");
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

function localActor(coordinator, identifier) {
    return new LocalActor(coordinator, identifier);
}

export default localActor;
 