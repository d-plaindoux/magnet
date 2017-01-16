/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import Reference from "./reference";

class ReferenceCoordinator extends Reference {
    
    constructor(name, boxes) {
        super(name);
        this.boxes = boxes;        
    }
    
    receiveRequest(request, response) {
        
    }
    
}

export default ReferenceCoordinator;