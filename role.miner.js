var behaviors = require('behaviors');

function run(creep) {
    // Priorities:
    // 1. Get to the mining site
    // 2. Mine energy
    // 3. Transfer energy to adjacent, non-miner creeps
    // 4. Build the mining storage (if capacity full)
    // 5. Repair the mining storage
    // 6. Transfer energy to the mining storage (if capacity full)



    var loc = creep.memory.mining_pos;
    var is_at_mine = (creep.pos.x === loc.x && creep.pos.y === loc.y);

    var container_blueprint = creep.room.find(
        FIND_CONSTRUCTION_SITES,
        {filter: site => (site.structureType === STRUCTURE_CONTAINER &&
                          Math.abs(site.pos.x - loc.x) <= 1 &&
                          Math.abs(site.pos.y - loc.y) <= 1) }
    )[0];

    var container = creep.room.find(
        FIND_STRUCTURES,
        {filter: struct => (struct.structureType === STRUCTURE_CONTAINER &&
                            Math.abs(struct.pos.x - loc.x) <= 1 &&
                            Math.abs(struct.pos.y - loc.y) <= 1 ) },
    )[0];

    var adjacent_creep = creep.room.find(
        FIND_MY_CREEPS,
        {filter: other => (other.memory.role !== 'miner' &&
                           Math.abs(creep.pos.x - other.pos.x) <= 1 &&
                           Math.abs(creep.pos.y - other.pos.y) <= 1) },
    )[0];

    var num_work_parts = creep.body
        .filter( part => part.type === WORK )
        .length
    ;
    var energy_per_tick = 2*num_work_parts;
    var at_full_capacity = (creep.carry[RESOURCE_ENERGY] + energy_per_tick <= creep.carryCapacity);




    // 1. Get to the mining site
    if(!is_at_mine) {
        creep.moveTo(loc.x, loc.y, {visualizePathStyle: {}});
    }

    // 2. Mine energy
    var source = Game.getObjectById(loc.source_id);
    creep.harvest(source);

    // 3. Transfer energy to adjacent, non-miner creeps
    if(adjacent_creep) {
        creep.say('I give!');
        creep.transfer(adjacent_creep, RESOURCE_ENERGY);
    }

    // 4. Build the mining storage (if capacity full)
    if(container_blueprint && at_full_capacity) {
        creep.say('I build!');
        creep.build(container_blueprint);
    }
    
    // 5. Repair the mining storage
    if(container && container.hits < container.hitsMax) {
        creep.say('I repair!');
        creep.repair(container);
    }

    // 6. Transfer energy to the mining storage (if capacity full)

};

module.exports = {
    run: run,
};
