var util = require('util');

function harvest_energy(creep) {
    if(creep.carry.energy === creep.carryCapacity) {
        return ERR_FULL;
    }

    var source_id = creep.memory.harvest_energy_source;
    if(source_id === undefined) {
        var sources = creep.room.find(FIND_SOURCES)
            .key_sort(util.source_harvest_rate);

        creep.memory.harvest_energy_source = sources[0].id;
        source_id = creep.memory.harvest_energy_source.id;
    }

    var source = Game.getObjectById(source_id);
    var res = creep.harvest(source);
    if(res === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {visualizePathStyle: {}});
    }
    return OK;
}

function move_randomly(creep) {
    var directions = [TOP_LEFT,    TOP,    TOP_RIGHT,
                      LEFT,                RIGHT,
                      BOTTOM_LEFT, BOTTOM, BOTTOM_RIGHT];
    var direction = directions[Math.floor(Math.random()*directions.length)];
    creep.move(direction);

    return OK;
}

function build_repair(creep) {
    var target_id = creep.memory.build_target;
    var target = Game.getObjectById(target_id);


    if(target_id === undefined || target === null || Math.random() < 0.01) {
        target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        if(target === null) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });
            target = targets[Math.floor(Math.random()*targets.length)];
        }

        if(target === undefined) {
            return ERR_NOT_FOUND;
        }
        creep.memory.build_target = target.id;
    }


    var res = creep.build(target);
    if(res === ERR_INVALID_TARGET) {
        res = creep.repair(target);
    }
    if(res === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle: {}});
    }

    return OK;
}

module.exports = {
    harvest_energy: harvest_energy,
    move_randomly: move_randomly,
    build_repair: build_repair,
};
