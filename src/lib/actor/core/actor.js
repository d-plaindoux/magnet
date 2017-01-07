/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */


class /* abstract */ Actor {
    
    constructor(coordinator, identifier) {
        if (new.target === Actor) {
            throw new TypeError("Abstract class");
        }
        
        this.identifier = identifier;
        this.coordinator = coordinator;
        this.pendingJobs = [];        
    }
    
    getIdentifier() {
        return this.identifier;
    }

    /* abstract */ isBound() {
        throw new EvalError("Not Implemented");
    }
    
    ask(request, response) {
        var self = this;
        
        this.pendingJobs.push(function () {
            self.coordinator.askNow(self.getIdentifier(), request, response);
        });
        
        this.coordinator.startActorRunner();
    }

    /* abstract */ askNow(request, response) {
        throw new EvalError("Not Implemented");
    }
        
    //
    // Management corner ...
    //

    bind(model) {
        var anActor = localActor(this.identifier, this.coordinator, model);
        this.coordinator.registerActor(anActor);
        
        if (model.boundAsActor) {
            model.boundAsActor();
        }

        return anActor;
    }    

    unbind() {
        if (model.unboundAsActor) {
            model.unboundAsActor();
        }        
    }

}

export default Actor;

