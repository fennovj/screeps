const roleUpgrader = {

    /**
     * Decide what a harvester shoud do. Mainly copied from the tutorial.
     * Will try to harvest from the same source everytime, depending on memory.id.
     * @param {Creep} creep The creep that is a harvester
     */
    run: function(creep) {
        if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
            creep.say('⚡ Upgrade');
        }
        if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true;
            creep.say('🌾 Harvest');
        }

        if (creep.memory.harvesting) {
            const sources = creep.room.find(FIND_SOURCES).sort();
            const sourceId = creep.memory.id % sources.length;
            if (creep.harvest(sources[sourceId]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[sourceId], {visualizePathStyle: {stroke: '#3355ff'}});
            }
        } else {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#3355ff'}});
            }
        }
    },
};

module.exports = roleUpgrader;
