const roleSpawner = {

    run: function(spawner, role, additional=[WORK, CARRY, MOVE]) {
        if (! role) {
            // If role is falsey, dno need to build anything
            return;
        }
        const shape = roleSpawner.calculate_worker_body(spawner, [WORK, CARRY, MOVE], additional);
        creepCounter = Memory['creep_counter'];
        const newCreepName = 'creep' + creepCounter;

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
    // For when we get our shit destroyed, we can at least create something
        const creepCounter = Memory['creep_counter'];
        const newCreepName = 'creep' + creepCounter;
        spawner.spawnCreep([WORK, CARRY, MOVE], newCreepName,
            {memory: {'role': 'harvester', 'id': creepCounter}});
    },

    total_capacity: function(spawner) {
        const extensions = spawner.room.find(FIND_MY_STRUCTURES).filter(
            (structure) => structure.structureType == STRUCTURE_EXTENSION).length;
        return ((50 * extensions) + (spawner.store.getCapacity(RESOURCE_ENERGY)));
    },

    calculate_worker_body: function(spawner, basic=[WORK, CARRY, MOVE],
        additional=[WORK, WORK, CARRY, MOVE]) {
    // Given total_capacity, creates an optimal worker body.
    // Optimal is very subjective, but this is a first attempt

        // Logic: we attempt to add the following:
        // WORK -> WORK -> CARRY -> MOVE
        // And repeat, until none of them succeed

        let totalCapacity = roleSpawner.total_capacity(spawner);
        // We need this much to be sure we can add something from the additional list
        const addSomething = Math.min(...additional.map((a) => BODYPART_COST[a]));

        // Start with basic worker
        const result = basic;
        totalCapacity -= basic.map((a) => BODYPART_COST[a]).reduce((a, b) => a+b);
        // Now repeatedly add from additional
        while (totalCapacity >= addSomething) {
            additional.forEach(function(part, ix) {
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
