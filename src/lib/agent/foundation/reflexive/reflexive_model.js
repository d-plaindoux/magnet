/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import objects from "../../../utils/objects";

class ReflexiveModel {
    
    // :: 'a -> ReflexiveModel 'a
    constructor(model) {
        this.model = model;
    }
    
    // :: (Request,Response?) -> unit
    accept(request, response) {
        if (this.model[request.name()]) {
            const method = this.model[request.name()];                
            try {
                this.success(response, method.apply(this.model, request.parameters()));
            } catch (e) {
                this.failure(response, e);
            }
        } else if (this.model.accept) {
            this.model.accept(request, response);
        } else {                
            this.failure(response, EvalError("Agent behavior not found"));
        }
    }
    
    // unit -> unit
    boundAsAgent(coordinator, agent) {
        if (this.model.boundAsAgent) {
            this.model.boundAsAgent(coordinator, agent);
        }
    }
    
    // unit -> unit
    unboundAsAgent() {
        if (this.model.unboundAsAgent) {
            this.model.unboundAsAgent();
        }
    }
 
    success(responseHandler, result) {
        if (responseHandler) {
            responseHandler.success(result);        
        }
    }
    
    failure(responseHandler, exception) {
        if (responseHandler) {
            responseHandler.failure(exception);        
        }
    }    
}

// :: 'a -> ReflexiveModel 'a  throws ReferenceError
function reflexiveModel(model) {
    objects.requireNonNull(model, "model");
    
    return new ReflexiveModel(model);
}

export default reflexiveModel;
 