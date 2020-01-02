const flag = require('util.flag');
const room = require('util.room');

const roleClaimer = {

    /** Tries to claim the controller
     * If there is no controller in range, move to a CLAIM* flag
     * If GCL not enough, reserve it instead
     * @param {Creep} creep the claimer creep
     */
    run: function(creep) {
        const targets = flag.get_claims();
        const targetId = creep.memory.id % targets.length;

        // First, make sure we are next to a flag
        if (! creep.pos.isNearTo(targets[targetId])) {
            creep.moveTo(targets[targetId], {visualizePathStyle: {stroke: '#22ff00'}});
            return;
        }
        const r = creep.claimController(creep.room.controller);
        if (r == ERR_GCL_NOT_ENOUGH) {
            creep.reserveController(creep.room.controller);
        } else if (r == 0) {
            // Success, we 'prepare' the room, then transition to builder
            room.prepare_after_control(creep.room, targets[targetId]);
            creep.memory.role = 'builder';
        }
    },


};

module.exports = roleClaimer;
