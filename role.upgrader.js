var behaviors = require('behaviors');

var roleUpgrader = {
    run: function(creep) {
        if(!creep.memory.hasOwnProperty('step')) {
            creep.memory.step = 'harvest';
        }

        if(creep.memory.step === 'harvest' &&
           creep.carry.energy == creep.carryCapacity) {
            creep.memory.step = 'dropoff';
        } else if(creep.memory.step === 'dropoff' &&
                  creep.carry.energy === 0){
            creep.memory.step = 'harvest';
        }

        if(creep.memory.step === 'harvest') {
            var err = behaviors.harvest_energy(creep);
            if(err) {
                behaviors.move_randomly(creep);
            }
        } else if(creep.memory.step === 'dropoff') {
            var target = creep.room.controller;
            var res = creep.upgradeController(target, RESOURCE_ENERGY);
            if(res === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {}});
            }
        }
    },
}

module.exports = roleUpgrader;
