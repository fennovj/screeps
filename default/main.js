const roleHarvester = require('role.harvester');
const roleBuilder = require('role.builder');
const roleSpawner = require('role.spawner');
const roleUpgrader = require('role.upgrader');
const constructionSite = require('util.constructionsite');
const room = require('util.room');

module.exports.loop = function() {
    // Initialization
    if (!Memory['creep_counter']) {
        Memory['creep_counter'] = 0;
    }

    // Memory cleanup
    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Main loop for creeps
    _.map(Game.creeps, (creep) => {
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    });

    // Main loop for spawners
    _.map(Game.spawns, (spawner) => {
        if (spawner.spawning) {
            roleSpawner.spawningInfo(spawner);
        } else {
            roleSpawner.run(spawner);
        }

        // Build as many extensions as possible around the spawner.
        // Might silently fail (e.g. if the controller level is too low)
        constructionSite.create_close(spawner, STRUCTURE_EXTENSION, 8);

        // Emergency code, should never be running unless we got attacked or something
        if (room.count_creeps(spawner.room)['numHarvesters'] == 0) {
            console.log('No harvesters detected, fallback building cheap harvester!');
            roleSpawner.fallback_harvester(spawner);
        }
    });
};
