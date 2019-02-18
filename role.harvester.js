var behaviors = require('behaviors');

var roleHarvester = {
    run: function(creep) {
        if(creep.carry.energy < creep.carryCapacity) {
            var err = behaviors.harvest_energy(creep);
            if(err) {
                behaviors.move_randomly(creep);
            }
            return;
        }

        var targets = creep.room.find(
            FIND_STRUCTURES,
            {filter: struct => (struct.structureType===STRUCTURE_SPAWN &&
                                struct.energy < struct.energyCapacity)

            },
        );
        if(targets.length) {
            var res = creep.transfer(targets[0], RESOURCE_ENERGY);
            if(res === ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {}});
            }
            return;
        }

        behaviors.move_randomly(creep);
    },
}

module.exports = roleHarvester;
