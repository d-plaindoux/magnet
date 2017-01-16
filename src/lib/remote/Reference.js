/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

class Reference {
    
    constructor(name) {
        this.name = name;
        this.coordinator = undefined;
    }
    
    boundToActor(coordinator) {
        this.coordinator = coordinator;
    }
    
    receiveRequest(request, response) {
        if (coordinator === undefined) {
            response.failure(new ReferenceError('Not yet bound'));
            return;
        }

        this.coordinator.ask(name, request, response);
    }
    
    unboundToActor() {
        this.coordinator = undefined;
    }
    
}

export default Reference;