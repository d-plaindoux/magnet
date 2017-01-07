/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import unboundActor from "./unbound_actor";

class Coordinator {
    
    // :: unit -> Coordinator
    constructor() {
        this.universe = {};
        
        this.pendingJobs = [];
        
        this.intervalJobs = 100 /*ms*/;
        this.intervalActors = 100 /*ms*/;
        
        this.jobRunnerInterval = undefined;
        this.actorRunnerInterval = undefined;
        
        this.logger = function () {
            // Do nothing
        };
    }   

    start() {
        if (this.pendingJobs.length > 0) {
            this.startActorRunner();
        }
        return this;
    }
    
    startJobRunner() {
        const self = this;
        
        if (this.jobRunnerInterval === undefined) {
            this.jobRunnerInterval = setInterval(
                () => self.jobRunner(), 
                this.intervalJobs
            );
        }
    }

    startActorRunner() {
        const self = this;
        
        if (this.actorRunnerInterval === undefined) {
            this.actorRunnerInterval = setInterval(
                () => self.actorRunner(), 
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
            clearInterval(this.jobRunnerInterval);
            this.jobRunnerInterval = undefined;
        }
    }

    stopActorRunner() {
        if (this.actorRunnerInterval !== undefined) {
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

        this.universe.forEach(function (actor) {
            if (actor.pendingJobs.length !== 0) {
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
        this.universe[anActor.getIdentifier()] = anActor;
    }

    disposeActor(identifier) {
        if (this.hasActor(identifier)) {
            this.deactivateActor(id);
            this.actor(identifier).unbind();
            delete this.universe[id];            
        }
    }

    //
    // Actor creation and deletion
    //

    hasActor(identifier) {
        return this.universe.hasOwnProperty(identifier);
    }

    actor(identifier) {
        var anActor = this.universe[identifier];

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
            this.startActorRunner();
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
function coordinator() {
    return new Coordinator();
}

export default coordinator;