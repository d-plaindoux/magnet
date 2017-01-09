/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import unboundActor from "./unbound_actor";

class Coordinator {
    
    // :: Logger -> Coordinator
    constructor(logger) {
        this.universe = new Map();
        
        this.pendingJobs = [];
        
        this.intervalJobs = 100 /*ms*/;
        this.intervalActors = 100 /*ms*/;
        
        this.started = false;
        
        this.jobRunnerInterval = undefined;
        this.actorRunnerInterval = undefined;
        
        this.logger = logger;
    }   

    // :: unit -> Coordinator
    start() {
        this.started = true;
        
        this.startJobRunner();
        this.startActorRunner();
        
        return this;
    }

    // :: (string, unit -> unit, int) -> Coordinator
    startRunner(name, callback, duration) {
        this.logger("Starting the " + name + " runner");
        return setInterval(callback, duration);
    }
    
    // :: unit -> unit
    startJobRunner() {
        if (this.started && this.jobRunnerInterval === undefined) {
            this.jobRunnerInterval = this.startRunner("job", () => this.jobRunner(), this.intervalJobs);
        }
    }

    // :: unit -> unit
    startActorRunner() {
        if (this.started && this.actorRunnerInterval === undefined) {
            this.actorRunnerInterval = this.startRunner("actor", () => this.actorRunner(), this.intervalActors);
        }
    }

    // :: unit -> Coordinator
    stop() {
        this.stopActorRunner();
        this.stopJobRunner();
        
        this.started = false;
        
        return this;
    }

    // :: (string,runner) -> undefined
    stopRunner(name, runner) {
        this.logger("Stopping the " + name + " runner");            
        clearInterval(runner);
        return undefined;
    }

    // :: unit -> unit
    stopJobRunner() {
        if (this.started && this.jobRunnerInterval !== undefined) {            
            this.jobRunnerInterval = this.stopRunner("job", this.jobRunnerInterval);
        }
    }

    // :: unit -> unit
    stopActorRunner() {
        if (this.started && this.actorRunnerInterval !== undefined) {            
            this.actorRunnerInterval = this.stopRunner("actor", this.actorRunnerInterval);
        }
    }
    
    //
    // Privates runners behaviors
    //

    // :: unit -> unit
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

    // :: unit -> unit
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

    // :: Actor -> unit
    registerActor(anActor) {
        this.universe.set(anActor.getIdentifier(), anActor);
    }

    // :: string -> unit
    disposeActor(identifier) {
        if (this.hasActor(identifier)) {
            this.actor(identifier).unbind();            
            this.universe.delete(identifier);            
        }
    }

    //
    // Actor creation and deletion
    //

    // :: string -> boolean
    hasActor(identifier) {
        return this.universe.has(identifier);
    }

    // :: string -> Actor
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

    // :: (string, Resquest, Response) -> unit
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

    // :: (string, Resquest, Response) -> unit
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

    // :: (Resquest) -> unit
    broadcast(request) {
        this.universe.forEach(anActor => anActor.ask(request));
    }

}

// :: Logger? -> Coordinator
function coordinator(logger) {
    return new Coordinator(logger || (message => console.log(new Date() + " :: " + message)));
}

export default coordinator;