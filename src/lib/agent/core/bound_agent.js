/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import objects from "../../utils/objects";

import functionalModel from "../foundation/functional/functional_model";

import Agent from "./agent";

class BoundAgent extends Agent {

    // :: (Coordinator,String,'a) -> BoundAgent 'a
    constructor(coordinator, identifier, model) {
        super(coordinator, identifier);

        this.model = this.handleModel(model);

        if (this.model.boundAsAgent) {
            this.model.boundAsAgent(this.coordinator, this);
        }
    }

    // :: unit -> boolean
    isBound() {
        return true;
    }

    // :: (Request,Response?) -> 'a'
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
        throw new EvalError("Agent already bound");
    }

    // :: unit -> unit
    unbind() {
        if (this.model.unboundAsAgent) {
            this.model.unboundAsAgent();
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

// :: (Coordinator,String,'a) -> BoundAgent 'a throws ReferenceError
function boundAgent(coordinator, identifier, model) {
    objects.requireNonNull(coordinator, "coordinator");
    objects.requireNonNull(identifier, "identifier");
    objects.requireNonNull(model, "model");

    return new BoundAgent(coordinator, identifier, model);
}

export default boundAgent;
