var behaviors = require('behaviors');

var roleBuilder = {
    run: function(creep) {
        if(!creep.memory.hasOwnProperty('step')) {
            creep.memory.step = 'harvest';
        }

        if(creep.memory.step === 'harvest' &&
           creep.carry.energy == creep.carryCapacity) {
            creep.memory.step = 'build';
        } else if(creep.memory.step === 'build' &&
                  creep.carry.energy === 0){
            creep.memory.step = 'harvest';
        }


        if(creep.memory.step === 'harvest') {
            var err = behaviors.harvest_energy(creep);
            if(err) {
                behaviors.move_randomly(creep);
            }
        } else if(creep.memory.step === 'build') {
            var err = behaviors.build_repair(creep);
            if(err) {
                behaviors.move_randomly(creep);
            }
        }
    },
}

module.exports = roleBuilder;
