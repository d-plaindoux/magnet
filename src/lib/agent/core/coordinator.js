/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import Promise from "promise"
import unboundAgent from "./unbound_agent";
import responseHandler from './response_handler';

class Coordinator {

    // :: Logger -> Coordinator
    constructor(logger) {
        this.universe = new Map();

        this.pendingJobs = [];

        this.intervalJobs = 1 /*ms*/;
        this.intervalAgents = 1 /*ms*/;

        this.started = false;

        this.jobRunnerInterval = undefined;
        this.agentRunnerInterval = undefined;

        this.logger = logger;
    }

    // :: unit -> Coordinator
    start() {
        this.started = true;

        this.startJobRunner();
        this.startAgentRunner();

        return this;
    }

    // :: (string, unit -> unit, int) -> Coordinator
    startRunner(name, callback, duration) {
        return setInterval(callback, duration);
    }

    // :: unit -> unit
    startJobRunner() {
        if (this.started && this.jobRunnerInterval === undefined) {
            this.jobRunnerInterval = this.startRunner("job", () => this.jobRunner(), this.intervalJobs);
        }
    }

    // :: unit -> unit
    startAgentRunner() {
        if (this.started && this.agentRunnerInterval === undefined) {
            this.agentRunnerInterval = this.startRunner("agent", () => this.agentRunner(), this.intervalAgents);
        }
    }

    // :: unit -> Coordinator
    stop() {
        this.stopAgentRunner();
        this.stopJobRunner();

        this.started = false;

        return this;
    }

    // :: (string,runner) -> undefined
    stopRunner(name, runner) {
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
    stopAgentRunner() {
        if (this.started && this.agentRunnerInterval !== undefined) {
            this.agentRunnerInterval = this.stopRunner("agent", this.agentRunnerInterval);
        }
    }

    //
    // Privates runners behaviors
    //

    // :: unit -> unit
    jobRunner() {
        while (this.pendingJobs.length > 0) {
            this.pendingJobs.shift()();
        }

        this.stopJobRunner();
    }

    // :: unit -> unit
    agentRunner() {
        this.universe.forEach(agent => {
            const message = agent.nextMessage();
            if (message) {
                this.pendingJobs.push(() =>
                    agent.askNow(message.request, message.response)
                );
            }
        });

        if (this.pendingJobs.length > 0) {
            this.startJobRunner();
        } else {
            this.stopAgentRunner();
        }
    }

    //
    // Agent (un)registration features
    //

    // :: Agent -> unit
    registerAgent(anAgent) {
        this.universe.set(anAgent.getIdentifier(), anAgent);
    }

    // :: string -> unit
    disposeAgent(identifier) {
        if (this.hasAgent(identifier)) {
            this.agent(identifier).unbind();
            this.universe.delete(identifier);
        }
    }

    //
    // Agent creation and deletion
    //

    // :: string -> boolean
    hasAgent(identifier) {
        return this.universe.has(identifier);
    }

    // :: string -> Agent
    agent(identifier) {
        var anAgent = this.universe.get(identifier);

        if (!anAgent) {
            anAgent = unboundAgent(this, identifier);
            this.registerAgent(anAgent);
        }

        return anAgent;
    }

    //
    // ask and broadcast mechanisms
    //

    // :: (string, 'a) -> Promise 'b
    ask(identifier, request, response) {
        return new Promise((onSuccess, onError) => {
            const response = responseHandler(onSuccess, onError);

            if (this.hasAgent(identifier)) {
                this.agent(identifier).ask(request, response);
            } else {
                response.failure(new EvalError("Agent not found"));
            }
        });
    }

    // :: 'a -> unit
    broadcast(request) {
        this.universe.forEach(anAgent => anAgent.ask(request));
    }

    //
    // Private behavior for immediat event processing
    //

    // :: (string, 'a, Response 'b) -> unit
    askNow(identifier, request, response) {
        if (this.hasAgent(identifier)) {
            this.agent(identifier).askNow(request, response);
        } else {
            if (response) {
                response.failure(new EvalError("Agent not found"));
            }
        }
    }
}

// :: Logger? -> Coordinator
function coordinator(logger) {
    return new Coordinator(logger || (message => console.log(new Date() + " :: " + message)));
}

export default coordinator;
