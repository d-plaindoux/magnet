/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import objects from "../../utils/objects";

/*
 * An agent reference encapsulates an agent definition.
 */

class /* abstract */ AgentReference {

    // :: Agent -> AgentReference
    constructor(agent) {
        this.agent = agent;
    }

    // :: unit -> Agent
    getAgent() {
        return this.agent;
    }

    // :: Agent -> unit
    setAgent(agent) {
        this.agent = agent;
    }
}

// :: Agent 'a -> AgentReference 'a throws ReferenceError
function agentReferene(agent) {
    objects.requireNonNull(agent, "agent");

    return new AgentReference(agent);
}

export default agentReferene;
