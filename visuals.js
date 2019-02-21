var spawning = require('spawning');

function census_by_list(creep_list) {
    var count = {};
    creep_list.forEach(creep => {
        count[creep.memory.role] = (count[creep.memory.role] || 0) + 1;
    });

    return Object.entries(count)
        .key_sort(e => e[0])
        .map(e => e[0] + ': ' + e[1])
        .join('\n')
    ;
}

function census(room) {
    var census = {
        exist: Object.values(Game.creeps),
        queued: spawning.queue,
    };

    var census_text = Object.entries(census)
        .map(e => e[0] + '\n' + census_by_list(e[1]))
        .join('\n');

    census_text
        .split(/\n/)
        .forEach( (text,line_num) => {
            room.visual.text(text,
                             5, 5+line_num,
                             {align: 'left'});
        })
    ;
}


module.exports = {
    census: census,
};
