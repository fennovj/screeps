const room = {

    count_creeps: function(room) {
        // Simple function that calculates the number of workers for each role in a room
        const harvesters = _.filter(Game.creeps,
            (creep) => creep.memory.role == 'harvester' && creep.room == room);
        const upgraders = _.filter(Game.creeps,
            (creep) => creep.memory.role == 'harvester' && creep.room == room);
        const builders = _.filter(Game.creeps,
            (creep) => creep.memory.role == 'harvester' && creep.room == room);
        return ({'numHarvesters': harvesters.length,
            'numUpgraders': upgraders.length,
            'numBuilders': builders.length});
    },

    say_creeps: function(room) {
        // Make all creeps say their role
        const creeps = _.filter(Game.creeps, (creep) => creep.room == room);
        _.each(creeps, (creep) => creep.say(creep.memory.role));
    },

    spawn: function(name = 'Spawn1') {
        // Convenience function because I found myself constantly having to type
        // The same stuff to get a room object.
        // Now I can just do `room.spawn('Spawn1')`, or `room.spawn()` for the starting room
        return (Game.spawns[name].room);
    },

};

module.exports = room;
