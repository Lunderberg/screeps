var spawning = require('spawning');

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



module.exports = {
    basic_workers: basic_workers,
};
