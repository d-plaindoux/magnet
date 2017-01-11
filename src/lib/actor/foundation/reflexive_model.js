/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import objects from "../../utils/objects";

class ReflexiveModel {
    
    // :: 'a -> ReflexiveModel 'a
    constructor(model) {
        this.model = model;
    }
    
    // :: (Request,Response?) -> unit
    receiveRequest(request, response) {
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
    }
    
    // unit -> unit
    boundAsActor(coordinator, actor) {
        if (this.model.boundAsActor) {
            this.model.boundAsActor(coordinator, actor);
        }
    }
    
    // unit -> unit
    unboundAsActor() {
        if (this.model.unboundAsActor) {
            this.model.unboundAsActor();
        }
    }
 

}

// :: 'a -> ReflexiveModel 'a  throws ReferenceError
function reflexiveModel(model) {
    objects.requireNonNull(model, "model");
    
    return new ReflexiveModel(model);
}

export default reflexiveModel;
 