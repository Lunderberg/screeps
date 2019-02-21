// List of creeps to be generated.
// Should be config objects with name, body, and memory
var queue = Memory.spawn_queue;
if(queue === undefined) {
    Memory.spawn_queue = [];
    queue = Memory.spawn_queue;
}


function do_spawn() {
    if(queue.length === 0) {
        return;
    }

    var spawn = Game.spawns['Spawn1'];

    var spawn_config = queue[0];

    var name = spawn_config.name + Game.time;
    var body = spawn_config.body;
    var memory = spawn_config.memory;

    var err = spawn.spawnCreep(
        body, name,
        {memory: memory, dryRun: true});
    if(!err) {
        spawn.spawnCreep(
            body, name,
            {memory: memory});
        queue.shift();
    }
}

function clear_queue() {
    queue.length = 0;
}

module.exports = {
    do_spawn: do_spawn,
    queue: queue,
    clear_queue: clear_queue,
};
