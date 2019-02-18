var roles = require('roles');
var spawning = require('spawning');
var construction = require('construction');
var economy = require('economy');

function clear_dead_memory() {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
}

module.exports.loop = function() {
    clear_dead_memory();

    construction.walls(Game.spawns['Spawn1'].room);

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        roles[creep.memory.role].run(creep);
    }

    //console.log(JSON.stringify(spawning.queue));

    economy.basic_workers();
    economy.economy();
    spawning.do_spawn();
};
