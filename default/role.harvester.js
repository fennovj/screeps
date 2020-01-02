const room = require('util.room');

const roleHarvester = {

    /**
     * Decide what a harvester shoud do. Mainly copied from the tutorial.
     * Will try to deposit in any extension or spawn with free capacity in the same room.
     * Will try to harvest from the same source everytime, depending on memory.id.
     * @param {Creep} creep The creep that is a harvester
     */
    run: function(creep) {
        if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
            creep.say('📦 Dropoff');
        }
        if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true;
            creep.say('🌾 Harvest');
        }

        if (creep.memory.harvesting) {
            const sources = creep.room.find(FIND_SOURCES).sort();
            const sourceId = creep.memory.id % sources.length;
            if (creep.harvest(sources[sourceId]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[sourceId], {visualizePathStyle: {stroke: '#22ff00'}});
            }
        } else {
            const targets = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                },
            }).sort();
            if (targets.length > 0) {
                const targetId = creep.memory.id % targets.length;
                if (creep.transfer(targets[targetId], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[targetId], {visualizePathStyle: {stroke: '#22ff00'}});
                }
            } else {
                // Everything is full, move to the spawner to not block the resource
                creep.moveTo(room.find_spawner(creep.room));
            }
        }
    },
};

module.exports = roleHarvester;
