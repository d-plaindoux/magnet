/*
 * Parsec
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import objects from "../../utils/objects";

class Message {
    
    // :: (string, Request,Response 'a 'b) -> Message 'a 'b
    constructor(identifier, request, response) {
        this._identifier = identifier;
        this._request = request;
        this._response = response;
    }
    
    // :: unit -> string
    identifier() {
        return this._identifier;
    }
    
    // :: unit -> Request
    request() {
        return this._request;
    }
    
    // :: unit -> Response 'a 'b
    response() {
        return this._response;
    }
}

// :: (string, Request, Response 'a 'b) -> Message 'a 'b throws ReferenceError
function message(identifier, request, response) {
    objects.requireNonNull(identifier, "identifier")
    objects.requireNonNull(request, "request")
    objects.requireNonNull(response, "response")

    return new Message(identifier, request, response);
}

export default message
