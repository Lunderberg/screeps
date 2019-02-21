var spawning = require('spawning');

function census(room) {
    var census = {
        exist: {},
        queued: {},
    };
    Object.values(Game.creeps)
        .forEach(creep => {
            if(census.exist[creep.memory.role] === undefined) {
                census.exist[creep.memory.role] = 0;
            }
            census.exist[creep.memory.role]++;
        });

    spawning.queue
        .forEach(creep => {
            if(census.queued[creep.memory.role] === undefined) {
                census.queued[creep.memory.role] = 0;
            }
            census.queued[creep.memory.role]++;
        });


    return census;
}


module.exports = {
    census: census,
};
