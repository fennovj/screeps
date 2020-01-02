const flag = {

    /*
    * For now, flags are assumed to be human-placed.
    * This seems like a somewhat safe bet since on the public
    * server, most players seem to only have ~5 areas max
    *
    * Flags are named: 'CLAIM*' or 'SPAWN*', where * is wildcard
    * I may add more names in the future
    */

    /*
    * Gets list of CLAIM flags
    * @return {Array} Array of flags
    */
    get_claims: function() {
        return (_.filter(Game.flags, (flag) => flag.name.startsWith('CLAIM')));
    },

    /*
    * Gets list of SPAWN flags
    * @return {Array} Array of flags
    */
    get_spawns: function(room) {
        _.filter(Game.flags, (flag) => flag.name.startsWith('SPAWN') && flag.room == room);
    },

};

module.exports = flag;
