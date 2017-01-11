/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

class FunctionalModel {
    
    constructor(funcall) {
        this.funcall = funcall;
    }
    
    receiveRequest(request, response) {
        this.funcall(request, response);
    }
       
}

function functionalModel(model) {    
    return new FunctionalModel(model);
}

export default functionalModel;