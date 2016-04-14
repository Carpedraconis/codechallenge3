function SafeCache() {

    var cache = Object.create( null );

    // Reveal the public API.
    return({
        get: get,
        has: has,
        remove: remove,
        set: set
    });


    // ---
    // PUBLIC METHODS.
    // ---


    function get( key ) {

        return( cache[ key ] );

    }


    function has( key ) {

        return( key in cache );

    }


    function remove( key ) {

        return( delete( cache[ key ] ), this );

    }


    function set( key, value ) {

        return( cache[ key ] = value, this );

    }

}


var safeCache = new SafeCache()
    .set( "foo", "Bar" )
    .set( "hello", "world" )
    .set( "beep", "boop" )
;

console.log( "## Safe Cache ##" );
console.log( safeCache.has( "foo" ) );
console.log( safeCache.has( "meep" ) );
console.log( safeCache.has( "valueOf" ) );
console.log( safeCache.has( "__proto__" ) );