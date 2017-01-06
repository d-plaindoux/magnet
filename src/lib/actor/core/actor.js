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

    activate() {
        this.coordinator.activateActor(this);
    }

    suspend() {
        this.coordinator.deactivateActor(this);
    }

    dispose() {
        this.coordinator.disposeActor(this.identifier);
    }

    bindToObject(model) {
        var anActor = localActor(this, jObj.bless(model, { actorId:this.identifier, coordinator:this.coordinator }));
        this.coordinator.registerActor(anActor);
        
        if (model.boundAsActor) {
            model.boundAsActor();
        }
        
        return anActor;
    }    
}

export default Actor;

