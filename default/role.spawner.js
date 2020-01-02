room = require('util.room');

const roleSpawner = {

    decide_spawn_config: function(spawner) {
        // Decide what a given spawner should build. Also defines the bodyparts design.
        // Deciding the bodyparts design may move to a different function in the future
        // buildRole falsey means that we have decided to build nothing,
        // even if there are enough resources.
        let buildRole = false;
        const basicShape = [WORK, CARRY, MOVE];
        let shape = [];

        workers = room.count_creeps(spawner.room);

        // For now only three possible things to build, with a maximum of how much of each we want.
        if (workers['numUpgraders'] < 10) {
            buildRole = 'upgrader';
            shape = [MOVE, MOVE, CARRY, CARRY, WORK];
        }
        if (workers['numBuilders'] < 3 && spawner.room.find(FIND_CONSTRUCTION_SITES).length) {
            // Only create builders if there are construction sites in the room
            buildRole = 'builder';
            shape = [WORK, WORK, CARRY, MOVE];
        }
        if (workers['numHarvesters'] < 2) {
            buildRole = 'harvester';
            shape = [WORK, WORK, CARRY, MOVE];
        }
        return ([buildRole, basicShape, shape]);
    },

    run: function(spawner) {
        const [role, basicShape, design] = roleSpawner.decide_spawn_config(spawner);
        if (! role) {
            // If role is falsey, no need to build anything
            return;
        }
        const shape = roleSpawner.calculate_worker_body(spawner, basicShape, design);
        const creepCounter = Memory['creep_counter'];
        const newCreepName = 'creep' + creepCounter;

        // Now check if we have enough resources for this design.
        const canSpawn = spawner.spawnCreep(shape, newCreepName, {dryRun: true});
        if (canSpawn == 0) {
            console.log('Now spawning ' + newCreepName +
                        ' with role ' + role + ' and body ' + shape);
            spawner.spawnCreep(shape, newCreepName,
                {memory: {'role': role, 'id': creepCounter}});
            Memory['creep_counter'] += 1;
        }
    },

    fallback_harvester: function(spawner) {
        if (!spawner.spawning) {
            // For when we get our shit destroyed, we can at least create something
            const creepCounter = Memory['creep_counter'];
            const newCreepName = 'creep' + creepCounter;
            spawner.spawnCreep([WORK, CARRY, MOVE], newCreepName,
                {memory: {'role': 'harvester', 'id': creepCounter}});
        }
    },

    total_capacity: function(spawner) {
        // Get the maximum capacity this spawner can have
        const extensions = spawner.room.find(FIND_MY_STRUCTURES).filter(
            (structure) => structure.structureType == STRUCTURE_EXTENSION).length;
        return ((50 * extensions) + (spawner.store.getCapacity(RESOURCE_ENERGY)));
    },

    calculate_worker_body: function(spawner, basicShape, design) {
        // Given total_capacity, creates an optimal worker body.
        // Optimal is very subjective, but this is a first attempt

        // Logic: we start with a basic shape, and then attempt to add the following:
        // WORK -> WORK -> CARRY -> MOVE, And repeat, until none of them succeed

        let totalCapacity = roleSpawner.total_capacity(spawner);
        // We need this much to be sure we can add something from the additional list
        const addSomething = _.min(design.map((a) => BODYPART_COST[a]));

        // Start with basic worker
        const result = basicShape;
        totalCapacity -= basicShape.map((a) => BODYPART_COST[a]).reduce((a, b) => a+b);
        // Now repeatedly add from additional
        while (totalCapacity >= addSomething) {
            design.forEach(function(part, ix) {
                if (totalCapacity >= BODYPART_COST[part]) {
                    result.push(part);
                    totalCapacity -= BODYPART_COST[part];
                }
            });
        }
        return (result);
    },

    spawningInfo: function(spawner) {
        const creepname = spawner.spawning.name;
        spawner.room.visual.text('🛠️' + Game.creeps[creepname].memory.role,
            spawner.pos.x + 1, spawner.pos.y, {align: 'left', opacity: 0.8});
    },
};

module.exports = roleSpawner;
