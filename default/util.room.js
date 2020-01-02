const room = {

    /**
     * Simple function that calculates the number of workers for each role in a room
     * @param {Room} room The room that is being evaluated
     * @return {dict} Dictionary with keys 'numHarvesters', 'numUpgraders', 'numBuilders'
     */
    count_creeps: function(room) {
        // Simple function that calculates the number of workers for each role in a room
        const harvesters = _.filter(Game.creeps,
            (creep) => creep.memory.role == 'harvester' && creep.room == room);
        const upgraders = _.filter(Game.creeps,
            (creep) => creep.memory.role == 'upgrader' && creep.room == room);
        const builders = _.filter(Game.creeps,
            (creep) => creep.memory.role == 'builder' && creep.room == room);
        return ({'numHarvesters': harvesters.length,
            'numUpgraders': upgraders.length,
            'numBuilders': builders.length});
    },

    /**
     * Make all creeps say their role
     * @param {Room} room The room that is being evaluated
     */
    say_creeps: function(room) {
        const creeps = _.filter(Game.creeps, (creep) => creep.room == room);
        _.each(creeps, (creep) => creep.say(creep.memory.role));
    },

    /**
     *
     * Convenience function because I found myself constantly having to type
     * The same stuff to get a room object.
     * Now I can just do `room.spawn('Spawn1')`, or `room.spawn()` for the starting room
     * @param {String} name The name of a spawner
     * @return {Room} The room that spawner is in
     */
    spawn: function(name = 'Spawn1') {
        return (Game.spawns[name].room);
    },

};

module.exports = room;
