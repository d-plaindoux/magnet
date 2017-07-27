/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

/*
 * An agent is able to do some work on demand.
 */

class /* abstract */ Agent {

    // :: (Coordinator,String) -> Agent
    constructor(coordinator, identifier) {
        // Since new.target is not supported in uglify stage
        if (this.constructor.name === 'Agent') {
            throw new TypeError("Abstract class");
        }

        this.identifier = identifier;
        this.coordinator = coordinator;

        this.mailbox = [];
    }

    // :: unit -> string
    getIdentifier() {
        return this.identifier;
    }

    // :: (Request,Response) -> unit
    ask(request, response) {
        this.mailbox.push({request:request, response:response});
        this.coordinator.startAgentRunner();
    }

    // :: unit -> (Request,Response)?
    nextMessage() {
        if (this.mailbox.length > 0) {
            return this.mailbox.shift();
        }

        return undefined;
    }
}

export default Agent;
