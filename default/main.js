const roleHarvester = require('role.harvester');
const roleBuilder = require('role.builder');
const roleSpawner = require('role.spawner');
const roleUpgrader = require('role.upgrader');
const constructionSite = require('util.constructionsite');

module.exports.loop = function() {
    /*
  for (const name in Game.rooms) {
    console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
  }
  */

    for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // Obviously change this to a loop when I have multiple rooms
    const myRoom = 'W6N1';

    let numUpgraders = 0;
    let numHarvesters = 0;
    let numBuilders = 0;

    _.map(Game.creeps, (creep) => {
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
            numHarvesters += 1;
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
            numBuilders +=1;
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
            numUpgraders += 1;
        }
    });

    console.log('Harvesters: ' + numHarvesters, 'Builders: ' + numBuilders,
        'Upgraders: ' + numUpgraders);

    // The later, the higher prio. We need at least 1 harvester.
    // I have a lot of upgraders since the controller is so far away
    let buildRole = false;
    let shape = [];
    if (numUpgraders < 10) {
        buildRole = 'upgrader';
        shape = [MOVE, MOVE, CARRY, CARRY, WORK];
    }
    if (numBuilders < 3 && Game.rooms[myRoom].find(FIND_CONSTRUCTION_SITES).length) {
        // Only create builders if there are construction sites
        buildRole = 'builder';
        shape = [WORK, WORK, CARRY, MOVE];
    }
    if (numHarvesters < 2) {
        buildRole = 'harvester';
        shape = [WORK, WORK, CARRY, MOVE];
    }

    spawners = Game.spawns;
    _.map(spawners, (spawner) => {
        if (spawner.spawning) {
            roleSpawner.spawningInfo(spawner);
        } else {
            roleSpawner.run(spawner, buildRole, shape);
        }

        // Build as many extensions as possible around the spawner.
        // Might silently fail (e.g. if the controller level is too low)
        // var numExtensions = Memory['n_extensions'][spawner.name];
        const success = constructionSite.create_close(spawner, STRUCTURE_EXTENSION, 8);
        if (success) {
            Memory['n_extensions'][name] += 1;
        }
    });

    if (numHarvesters == 0) {
        console.log('No harvesters detected, fallback building cheap harvester on all spawners!');
        _.map(spawners, (spawner) => {
            roleSpawner.fallback_harvester(spawner);
        });
    }
};
