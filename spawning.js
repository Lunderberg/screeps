function spawning(configs) {
    var spawn = Game.spawns['Spawn1'];

    var creeps = [];
    for(var name in Game.creeps) {
        creeps.push(Game.creeps[name]);
    }

    configs.forEach(config => {
        var num_existing = creeps
            .filter(creep => creep.memory.role === config.role)
            .length;
        if(num_existing < config.min_number) {
            var res = spawn.spawnCreep(config.body, config.name + Game.time,
                                       {memory: {role: config.role}});
        }
    });
}

module.exports = spawning;
