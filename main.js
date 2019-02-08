var roles = require('roles');
var spawning = require('spawning');
var construction = require('construction');

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

function clear_dead_memory() {
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
}

module.exports.loop = function() {
    clear_dead_memory();
    spawning(spawn_configs);

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        roles[creep.memory.role].run(creep);
    }

    construction.walls(Game.spawns['Spawn1'].room);
};
