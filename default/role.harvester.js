const roleHarvester = {

    /** @param {Creep} creep **/
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
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                },
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#22ff00'}});
                }
            }
        }
    },
};

module.exports = roleHarvester;
