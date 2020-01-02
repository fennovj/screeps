room = require('util.room');

const roleSpawner = {


    /**
     * Get single action for a spawner. First, decide_spawn_config to decide what to spawn
     * Then get the shape. Then, try to build it in a dryRun, and if succesful, actually build it
     * @param {Spawner} spawner The spawner to act
     */
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

    /**
     * Decide what role a given spawner should build, and the bodypart design.
     * Works by counting the creeps in the room of the spawner, and building
     * what there is not enough of
     * @param {Spawner} spawner The spawner to decide for.
     * @return {[String, Shape, Shape]}  Array of three elements.
     * - role: The role to build. If falsey, we have decided to not build anything
     * - basicShape: The basic shape the design should have
     * - design: The additional parts the design should have, if cost allows
     */
    decide_spawn_config: function(spawner) {
        let buildRole = false;
        const basicShape = [WORK, CARRY, MOVE];
        let shape = [];

        workers = room.count_creeps(spawner.room);

        // For now, three possible things to build, with a maximum of how much of each we want.
        if (workers['numUpgraders'] < 10) {
            buildRole = 'upgrader';
            shape = [MOVE, MOVE, CARRY, CARRY, WORK];
        }
        if (workers['numBuilders'] < 3 && spawner.room.find(FIND_CONSTRUCTION_SITES).length) {
            // Only create builders if there are construction sites in the room
            buildRole = 'builder';
            shape = [WORK, CARRY, MOVE];
        }
        if (workers['numHarvesters'] < 5) {
            buildRole = 'harvester';
            shape = [WORK, CARRY, MOVE];
        }
        return ([buildRole, basicShape, shape]);
    },

    /**
     * Emergency function that creates a basic harvester
     * Should only be called after we got attacked or something
     * @param {Spawner} spawner the spawner to create a harvester
     */
    fallback_harvester: function(spawner) {
        if (!spawner.spawning) {
            const creepCounter = Memory['creep_counter'];
            const newCreepName = 'creep' + creepCounter;
            spawner.spawnCreep([WORK, CARRY, MOVE], newCreepName,
                {memory: {'role': 'harvester', 'id': creepCounter}});
        }
    },

    /**
     * Calculates the maximum capacity this spawner can have.
     * Its own capacity, plus 50 for each exetension in the room
     * @param {Spawner} spawner The spawner for which to calculate maximum capacity
     * @return {Int} capacity The maximum capacity for this spawner
     */
    total_capacity: function(spawner) {
        const extensions = spawner.room.find(FIND_MY_STRUCTURES).filter((structure) =>
            structure.structureType == STRUCTURE_EXTENSION &&
            structure.room == spawner.room).length;
        return ((50 * extensions) + (spawner.store.getCapacity(RESOURCE_ENERGY)));
    },

    /**
     * Given total_capacity, creates an optimal worker body.
     * Optimal is very subjective, but this is a first attempt

     * Logic: we start with a basic shape, and then attempt to add the following:
     * WORK -> WORK -> CARRY -> MOVE, And repeat, until none of them succeed
     * @param {Spawner} spawner The spawner with a certain capacity
     * @param {Shape} basicShape The basic shape the design should have
     * @param {Shape} design The additional parts the design should have, if cost allows
     * @return {Shape} The final shape, that will maximally use the capacity of the spawner
     */
    calculate_worker_body: function(spawner, basicShape, design) {
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

    /**
     * Display information while this spawner is spawning
     * @param {Spawner} spawner The spawner that is spawning
     */
    spawningInfo: function(spawner) {
        const creepname = spawner.spawning.name;
        spawner.room.visual.text('🛠️' + Game.creeps[creepname].memory.role,
            spawner.pos.x + 1, spawner.pos.y, {align: 'left', opacity: 0.8});
    },
};

module.exports = roleSpawner;
