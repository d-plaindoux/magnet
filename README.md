# Magnet

[![Build Status](https://travis-ci.org/d-plaindoux/magnet.svg?branch=master)](https://travis-ci.org/d-plaindoux/magnet)
[![Coverage Status](https://coveralls.io/repos/github/d-plaindoux/magnet/badge.svg?branch=master)](https://coveralls.io/github/d-plaindoux/magnet?branch=master)

## Introduction

Magnet is a simple library dedicated to actor execution enabling actor 
registration and binding thanks to a coordinator component.

### Hello World!

An actor has the capability to communicate with a model. Such model can
be a simple class of a function.

#### Functional style

```javascriot
function hello(request, response) {
    response.success("Hello " + request + "!");
}
```

Then such function can simply managed by an actor and hosted by a given 
coordinator.

```javascriot
const aCoordinator = coordinator(),
      aResponse    = response(v => console.log(v))

aCoordinator.actor("hello").bind(hello);
aCoordinator.ask("hello", "World", aResponse);  
// prints "Hello World!" on the console

```

#### The Object-Oriented style

```javascriot
class Hello {
    receiveRequest(request, response) {
        response.success("Hello " + request + "!");
    }
}
```

```javascriot
const aCoordinator = coordinator(),
      aResponse    = response(v => console.log(v))

aCoordinator.actor("hello").bind(new Hello());
aCoordinator.ask("hello", "World", aResponse);  
// prints "Hello World!" on the console

```

## License

Copyright (C)2017 D. Plaindoux.

This program is  free software; you can redistribute  it and/or modify
it  under the  terms  of  the GNU  Lesser  General  Public License  as
published by  the Free Software  Foundation; either version 2,  or (at
your option) any later version.

This program  is distributed in the  hope that it will  be useful, but
WITHOUT   ANY  WARRANTY;   without  even   the  implied   warranty  of
MERCHANTABILITY  or FITNESS  FOR  A PARTICULAR  PURPOSE.  See the  GNU
Lesser General Public License for more details.

You  should have  received a  copy of  the GNU  Lesser General  Public
License along with  this program; see the file COPYING.  If not, write
to the  Free Software Foundation,  675 Mass Ave, Cambridge,  MA 02139,
USA.




