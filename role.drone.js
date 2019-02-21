var util = require('util');

function run(creep) {
    // Steps

    // 1. Acquire energy.  Terminate step when energy is full.
    // 1a. If containers exist with energy, go to them.
    // 1b. If no containers exist, go to energy source and mine.

    // 2. Spend energy.  Terminate step when energy is empty.
    // 2a. If spawn isn't full, dropoff at spawn.
    // 2b. If non-wall/rampart buildings are below 10% health, repair.
    // 2c. If wall/ramparts are below 10k health, repair.
    // 2d. If controller's ticksToDowngrade < 1000, upgrade.
    // 2e. If construction sites exist, build.
    // 2f. If non-wall/rampart buildings are below full health, repair.
    // 2g. If rand() < 30%, repair weakest wall/rampart.
    // 2h. Upgrade controller.

    update_creep_state(creep);
    take_action(creep);
}

function update_creep_state(creep) {
    var state = creep.memory.drone_state;

    if(state === undefined) {
        creep.memory.drone_state = {step: 'spend_energy'};
        state = creep.memory.drone_state;
    }

    if(state.step !== 'get_energy' && creep.carry.energy === 0) {
        state.step = 'get_energy';
        state.action = null;
        state.target = choose_energy_source(creep).id;
    } else if((state.step === 'get_energy' &&
               creep.carry.energy === creep.carryCapacity) ||
              (state.step === 'spend_energy' &&
               target_is_invalid(state) ) ) {

        state.step = 'spend_energy';
        Object.assign(state, choose_energy_target(creep));
    }
}

function choose_energy_source(creep) {
    var source = creep.room.find(FIND_SOURCES)
        .random_choice();
    return source;
}

function choose_energy_target(creep) {
    var room = creep.room;

    // If room doesn't have full energy.
    if(room.energyAvailable < room.energyCapacityAvailable) {
        creep.say('Fill spawn!');
        var target = room
            .find(FIND_STRUCTURES)
            .filter(struct =>
                    ((struct.structureType === STRUCTURE_SPAWN ||
                      struct.structureType === STRUCTURE_EXTENSION) &&
                     struct.energy < struct.energyCapacity)
                   )[0];
        return {action: 'transfer',
                target: target.id};
    }

    // If buildings are below 10% health
    var low_health_building = room
        .find(FIND_STRUCTURES)
        .filter(struct => (struct.structureType !== STRUCTURE_WALL &&
                           struct.structureType !== STRUCTURE_RAMPART &&
                           struct.hits < struct.hitsMax*0.1) )
        .min( struct => struct.hits / struct.hitsMax )
    ;
    if(low_health_building !== undefined) {
        creep.say('Save building!');
        return {action: 'repair',
                target: low_health_building.id};
    }

    // If walls/ramparts are below 10k health
    var low_health_wall = room
        .find(FIND_STRUCTURES)
        .filter(struct => ((struct.structureType === STRUCTURE_WALL ||
                            struct.structureType === STRUCTURE_RAMPART) &&
                           struct.hits < 10000) )
        .min( struct => struct.hits )
    ;
    if(low_health_wall !== undefined) {
        creep.say('Save wall!');
        return {action: 'repair',
                target: low_health_wall.id};
    }

    // If controller is going to downgrade
    if(room.controller.ticksToDowngrade < 1000) {
        creep.say('Save controller!');
        return {action: 'upgradeController',
                target: room.controller.id};
    }

    // If construction sites exist
    var construction_site = creep.pos
        .findClosestByRange(FIND_CONSTRUCTION_SITES);
    if(construction_site !== null) {
        creep.say('Build stuff!');
        return {action: 'build',
                target: construction_site.id};
    }

    // If non-wall/ramparts are below full health
    // If buildings are below 10% health
    var damaged_building = creep.pos
        .findClosestByRange(
            FIND_STRUCTURES,
            {filter: struct => (struct.structureType !== STRUCTURE_WALL &&
                                struct.structureType !== STRUCTURE_RAMPART &&
                                struct.hits < struct.hitsMax) },
        );
    ;
    if(damaged_building !== null) {
        creep.say('Strong repair!');
        return {action: 'repair',
                target: damaged_building.id};
    }

    // If walls exist, 30% chance of repair weakest wall
    var weakest_wall = room
        .find(FIND_STRUCTURES)
        .filter(struct => (struct.structureType === STRUCTURE_WALL &&
                           struct.structureType === STRUCTURE_RAMPART &&
                           struct.hits < struct.hitsMax) )
        .min(struct => struct.hits)
    ;
    if(weakest_wall !== undefined && Math.random()<0.3) {
        creep.say('Strong wall!');
        return {action: 'repair',
                target: weakest_wall.id};
    }

    // Otherwise, upgrade controller
    creep.say('Better room!');
    return {action: 'upgradeController',
            target: room.controller.id};
}

function target_is_invalid(state) {
    var target = Game.getObjectById(state.target);
    if(target === null) {
        return true;
    }

    if(state.action === 'repair') {
        return target.hits === target.hitsMax;
    } else if (state.action === 'transfer') {
        return target.energy === target.energyCapacity;
    } else if (state.action === 'build') {
        // If construction site no longer exists, target won't exist.
        return false;
    } else if (state.action === 'upgradeController') {
        return false;
    }
}

function take_action(creep) {
    var state = creep.memory.drone_state;

    if(state.step === 'get_energy') {
        get_energy(creep);
    } else if (state.step === 'spend_energy') {
        spend_energy(creep);
    }
}

function get_energy(creep) {
    // Pick up any dropped energy in range
    var resource = creep.pos.findClosestByRange(
        FIND_DROPPED_RESOURCES,
        {filter: r => r.resourceType===RESOURCE_ENERGY},
    );
    if(resource) {
        creep.pickup(resource);
    }


    var energy_source = Game.getObjectById(creep.memory.drone_state.target);

    // Grab from the container next to the energy source.
    var container = energy_source.pos
        .findClosestByRange(
            FIND_STRUCTURES,
            {filter: struct => struct.structureType===STRUCTURE_CONTAINER}
        )
    ;
    if(container) {
        creep.withdraw(container, RESOURCE_ENERGY);
    }

    // Try to mine from the energy source
    var err = creep.harvest(energy_source);
    if(err === ERR_NOT_IN_RANGE) {
        // Prefer to move toward the container, in case miners are in
        // front of the energy source.
        creep.moveTo(container || energy_source, {visualizePathStyle: {}});
    }
}

function spend_energy(creep) {
    var state = creep.memory.drone_state;
    var target = Game.getObjectById(state.target);

    var err = null;
    if(state.action === 'repair') {
        err = creep.repair(target);
    } else if (state.action === 'transfer') {
        err = creep.transfer(target, RESOURCE_ENERGY);
    } else if (state.action === 'upgradeController') {
        err = creep.upgradeController(target);
    } else if (state.action === 'build') {
        err = creep.build(target);
    }

    if(err === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle: {}});
    }
}

module.exports = {
    run: run,
};
