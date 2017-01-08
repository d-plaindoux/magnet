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
    
    ask(request, response) {    
        this.pendingJobs.push(() => 
            this.coordinator.askNow(this.getIdentifier(), request, response)
        );        
        this.coordinator.startActorRunner();
    }
}

export default Actor;

