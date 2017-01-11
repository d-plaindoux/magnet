/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */


class /* abstract */ Actor {
    
    // :: (Coordinator,String) -> Actor
    constructor(coordinator, identifier) {
        // Since new.target is not supported in uglify stage            
        if (this.constructor.name === 'Actor') { 
            throw new TypeError("Abstract class");
        }
        
        this.identifier = identifier;
        this.coordinator = coordinator;
        
        this.pendingJobs = [];        
    }
    
    // :: unit -> string
    getIdentifier() {
        return this.identifier;
    }        
    
    // :: (Request,Response) -> unit
    ask(request, response) {    
        this.pendingJobs.push(() => 
            this.coordinator.askNow(this.getIdentifier(), request, response)
        );        
        this.coordinator.startActorRunner();
    }
}

export default Actor;

