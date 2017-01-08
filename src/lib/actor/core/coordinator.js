/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import unboundActor from "./unbound_actor";

class Coordinator {
    
    // :: Logger? -> Coordinator
    constructor(logger) {
        this.universe = new Map();
        
        this.pendingJobs = [];
        
        this.intervalJobs = 100 /*ms*/;
        this.intervalActors = 100 /*ms*/;
        
        this.jobRunnerInterval = undefined;
        this.actorRunnerInterval = undefined;
        
        this.logger = logger || (message => console.log(new Date() + " :: " + message));
    }   

    start() {
        if (this.pendingJobs.length > 0) {
            this.startActorRunner();
        }
        return this;
    }
    
    startJobRunner() {
        if (this.jobRunnerInterval === undefined) {
            this.logger("Starting the job runner");
            this.jobRunnerInterval = setInterval(
                () => this.jobRunner(), 
                this.intervalJobs
            );
        }
    }

    startActorRunner() {
        if (this.actorRunnerInterval === undefined) {
            this.logger("Starting the actor runner");            
            this.actorRunnerInterval = setInterval(
                () => this.actorRunner(),
                this.intervalActors
            );
        }
    }

    stop() {
        this.stopJobRunner();
        this.stopActorRunner();
    }

    stopJobRunner() {
        if (this.jobRunnerInterval !== undefined) {
            this.logger("Stopping the job runner");            
            clearInterval(this.jobRunnerInterval);
            this.jobRunnerInterval = undefined;
        }
    }

    stopActorRunner() {
        if (this.actorRunnerInterval !== undefined) {
            this.logger("Stopping the actor runner");            
            clearInterval(this.actorRunnerInterval);
            this.actorRunnerInterval = undefined;
        }
    }
    
    //
    // Privates runners behaviors
    //

    jobRunner() {
        if (this.pendingJobs.length > 0) {
            try {
                this.pendingJobs.shift()();
            } catch (e) {
                if (this.logger) {
                    this.logger(e);
                }
            }
        } else {
            this.stopJobRunner();
        }
    }

    actorRunner() {
        const self = this;

        this.universe.forEach(actor => {
            if (actor.pendingJobs.length > 0) {
                self.pendingJobs.push(actor.pendingJobs.shift());
            }
        });

        if (this.pendingJobs.length > 0) {
            this.startJobRunner();
        } else {
            this.stopActorRunner();
        }
    }

    //
    // Actor (un)registration features
    //

    registerActor(anActor) {
        this.universe.set(anActor.getIdentifier(), anActor);
    }

    disposeActor(identifier) {
        if (this.hasActor(identifier)) {
            this.deactivateActor(id);
            this.actor(identifier).unbind();
            this.universe.delete(id);            
        }
    }

    //
    // Actor creation and deletion
    //

    hasActor(identifier) {
        return this.universe.has(identifier);
    }

    actor(identifier) {
        var anActor = this.universe.get(identifier);

        if (!anActor) {
            anActor = unboundActor(this, identifier);
            this.registerActor(anActor);
        }

        return anActor;
    }

    //
    // ask and broadcast mechanisms
    //

    ask(identifier, request, response) {
        if (this.hasActor(identifier)) {
            this.actor(identifier).ask(request, response);
        } else {
            if (response) {
                response.failure(new EvalError("Actor not found"));
            } else {
                throw new EvalError("Actor not found");                
            }
        }
    }

    askNow(identifier, request, response) {
        if (this.hasActor(identifier)) {
            this.actor(identifier).askNow(request, response);
        } else {
            if (response) {
                response.failure(new EvalError("Actor not found"));
            } else {
                throw new EvalError("Actor not found");
            }
        }
    }

    broadcast(request) {
        this.universe.forEach(anActor => anActor(identifier).ask(request));
    }

}

// :: unit -> Coordinator throws ReferenceError
function coordinator(logger) {
    return new Coordinator(logger);
}

export default coordinator;