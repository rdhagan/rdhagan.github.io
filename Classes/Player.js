
function Player(ent) {
    this.entity = ent;
    this.stats = {
        Health: 10,
        TotalHealth: 10,
        Attack: 4,
        Defense: 1
    };
    this.dealDamage = function(damage) {
        this.stats.Health -= damage;
        if (this.stats.Health <= 0) {
            this.stats.Health = 0;
            this.die();
        }
    }
    this.die = function() {
        this.entity.destroyed = true;
    }
}

