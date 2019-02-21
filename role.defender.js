var behaviors = require('behaviors');

function run(creep) {
    if(creep.memory.target === undefined ||
       Game.getObjectById(creep.memory.target) === null) {

        var targets = creep.room.find(FIND_HOSTILE_CREEPS);
        if(targets.length) {
            creep.memory.target = targets[0].id;
        } else {
            behaviors.move_randomly(creep);
            return;
        }
    }

    var target = Game.getObjectById(creep.memory.target);
    var err = creep.rangedAttack(target);
    if(err === ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
}

module.exports = {
    run: run,
};
