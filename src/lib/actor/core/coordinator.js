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
        
        this.started = false;
        
        this.jobRunnerInterval = undefined;
        this.actorRunnerInterval = undefined;
        
        this.logger = logger || (message => console.log(new Date() + " :: " + message));
    }   

    start() {
        this.started = true;
        
        this.startJobRunner();
        this.startActorRunner();
        
        return this;
    }

    startRunner(name, callback, duration) {
        this.logger("Starting the " + name + " runner");
        return setInterval(callback, duration);
    }
    
    startJobRunner() {
        if (this.started && this.jobRunnerInterval === undefined) {
            this.jobRunnerInterval = this.startRunner("job", () => this.jobRunner(), this.intervalJobs);
        }
    }

    startActorRunner() {
        if (this.started && this.actorRunnerInterval === undefined) {
            this.actorRunnerInterval = this.startRunner("actor", () => this.actorRunner(), this.intervalActors);
        }
    }

    stop() {
        this.stopActorRunner();
        this.stopJobRunner();
        
        this.started = false;
        
        return this;
    }

    stopRunner(name, runner) {
        this.logger("Stopping the " + name + " runner");            
        clearInterval(runner);
        return undefined;
    }

    stopJobRunner() {
        if (this.started && this.jobRunnerInterval !== undefined) {            
            this.jobRunnerInterval = this.stopRunner("job", this.jobRunnerInterval);
        }
    }

    stopActorRunner() {
        if (this.started && this.actorRunnerInterval !== undefined) {            
            this.actorRunnerInterval = this.stopRunner("actor", this.actorRunnerInterval);
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
                this.logger(e);
            }
        } else {
            this.stopJobRunner();
        }
    }

    actorRunner() {
        this.universe.forEach(actor => {
            if (actor.pendingJobs.length > 0) {
                this.pendingJobs.push(actor.pendingJobs.shift());
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
            this.actor(identifier).unbind();            
            this.universe.delete(identifier);            
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
                this.logger("Actor " + request.getIdentifier() + " not found");
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
                this.logger("Actor " + request.getIdentifier() + " not found");
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