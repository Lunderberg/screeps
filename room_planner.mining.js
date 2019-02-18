require('util');

function source_mining_locations(source) {
    var terrain = source.room.getTerrain();

    var locs = [{source_id: source.id, x: source.pos.x+1, y: source.pos.y+1},
                {source_id: source.id, x: source.pos.x+0, y: source.pos.y+1},
                {source_id: source.id, x: source.pos.x-1, y: source.pos.y+1},
                {source_id: source.id, x: source.pos.x+1, y: source.pos.y+0},
                {source_id: source.id, x: source.pos.x-1, y: source.pos.y+0},
                {source_id: source.id, x: source.pos.x+1, y: source.pos.y-1},
                {source_id: source.id, x: source.pos.x+0, y: source.pos.y-1},
                {source_id: source.id, x: source.pos.x-1, y: source.pos.y-1},
               ]
        .filter(pos => terrain.get(pos.x, pos.y) !== TERRAIN_MASK_WALL)
        .key_sort( (pos, i, arr) => {
            return -1 * arr
                .filter( other => (Math.abs(pos.x-other.x)<=1 &&
                                   Math.abs(pos.y-other.y)<=1) )
                .length;
        })
        .map( (pos,i) => {
            pos.type = (i==0 ? 'primary' : 'secondary');
            return pos;
        })
    ;

    return locs;
};

function choose_energy_mining_spots(room) {
    return room.find(FIND_SOURCES)
        .map(source => source_mining_locations(source))
        .flat()
    ;
}



module.exports = {
    choose_energy_mining_spots: choose_energy_mining_spots,
};
