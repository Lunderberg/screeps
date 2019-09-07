Array.prototype.flat = function() {
    return [].concat(...this);
};

Array.prototype.key_sort = function(key) {
    var output = this
        .map( (item,i,arr) => [key(item,i,arr), item] )
        .sort( (a,b) => {
            if(a[0] < b[0]) { return -1; }
            if(b[0] < a[0]) { return +1; }
            return 0;
        })
        .map( tagged_item => tagged_item[1] );

    // Replaces input array with sorted output
    this.splice(0, this.length, ...output);
    return output;
};

Array.prototype.max = function(key) {
    if(key === undefined) {
        key = function(x) { return x; }
    }

    return this
        .slice()
        .key_sort(key)[this.length-1];
};

Array.prototype.min = function(key) {
    if(key === undefined) {
        key = function(x) { return x; }
    }

    return this
        .slice()
        .key_sort(key)[0];
};

Array.prototype.sum = function() {
    return this.reduce( (cumsum, num) => cumsum+num, 0);
};

Array.prototype.random_choice = function() {
    return this[Math.floor(this.length*Math.random())];
};

Array.prototype.extend = function(arr) {
    this.push(...arr);
};

function creep_cost(body_parts) {
    return body_parts
        .map( part => BODYPART_COST[part])
        .sum();
}

function source_harvest_rate(source) {
    if(source.ticksToRegeneration === undefined) {
        return 0;
    }

    var regen_ticks = 300;
    return (source.energyCapacity - source.energy) /
        (regen_ticks - source.ticksToRegeneration);
}

module.exports = {
    creep_cost: creep_cost,
    source_harvest_rate: source_harvest_rate,
};
