var spawning = require('spawning');
var util = require('util');

function basic_workers() {
    var spawn_configs = [
        {role: 'harvester',
         name: 'Harvester',
         body: [MOVE, CARRY, WORK],
         min_number: 4},

        {role: 'upgrader',
         name: 'Upgrader',
         body: [MOVE, CARRY, WORK],
         min_number: 2},

        {role: 'builder',
         name: 'Builder',
         body: [MOVE, CARRY, WORK],
         min_number: 4},
    ];

    var num_existing = {};
    spawn_configs.forEach(config => {
        num_existing[config.role] = 0;
    });

    Object.values(Game.creeps)
        .concat(spawning.queue)
        .forEach(creep => {
            if(num_existing[creep.memory.role] !== undefined) {
                num_existing[creep.memory.role]++;
            }
        });

    spawn_configs.forEach(config => {
        for(var i=num_existing[config.role]; i<config.min_number; i++) {
            spawning.queue.push({name: config.name,
                                 body: config.body,
                                 memory: {role: config.role},
                                });
        }
    });
}

function queue_spawn_miners() {
    var energy_capacity_available = Object.values(Game.spawns)
        .map( spawn => spawn.room.energyCapacityAvailable )
        .max()
    ;

    var body_types = [
        [MOVE, WORK, WORK, CARRY],
        [MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY],
        [MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY],
    ];

    var body = body_types
        .filter( body =>
                 util.creep_cost(body) <= energy_capacity_available
               )[0];

    var num_work_parts = body
        .filter( part => (part === WORK) )
        .length
    ;

    // console.log(energy_capacity_available);
    // console.log(energy_capacity_available.max);

    var assigned_spots = Object.values(Game.creeps)
        .concat(spawning.queue)
        .filter(creep => creep.memory.role === 'miner')
        .map(creep => creep.memory.mining_pos)
    ;

    Object.values(Game.rooms)
        .filter( (room) => {
            return room.memory.plan !== undefined;
        })
        .map( room => room.memory.plan.energy_mining_spots )
        .flat()
        .filter( pos => (pos.type === 'primary' ||
                         num_work_parts < 6) )
        .filter( pos => assigned_spots.every(
            assigned_spot => (assigned_spot.x !== pos.x ||
                              assigned_spot.y !== pos.y)
        ))
        .forEach( pos => {
            var memory = {
                role: 'miner',
                mining_pos: pos,
            };

            spawning.queue.push({
                name: 'Miner',
                body: body,
                memory: memory,
            });
        })
    ;


}


module.exports = {
    basic_workers: basic_workers,
    queue_spawn_miners: queue_spawn_miners,
};
