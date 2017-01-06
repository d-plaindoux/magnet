/*
 * Magnet
 * https://github.com/d-plaindoux/magnet
 *
 * Copyright (c) 2017 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

// :: ('a, string) -> 'a throws Error
function requireNonNull(value, variableName) {
    if (value === null || value === undefined) {
        throw new ReferenceError(variableName + " is not defined");
    }
    
    return value;
}

export default {
    requireNonNull: requireNonNull
}