
function Scene(threeScene) {
    this.threeScene = threeScene;
    this.entities = [];

    this.addEntity = function(ent) {
        this.entities.push(ent);
    }
    this.update = function(dt) {
    	for (var key in this.entities) {
            var ent = this.entities[key];
            ent.update(dt);
        }
        for (var key in this.entities) {
            var ent = this.entities[key];

            if (ent.destroyed) {
                if (ent.obj != null) {
                    threeScene.remove(ent.obj);
                }
                this.entities.splice(key, 1);
            }
        }
        var ent1, ent2;
        for (var ent1Key in this.entities) {
            ent1 = this.entities[ent1Key];
            if (ent1.moved) {
                for (var ent2Key in this.entities) {
                    ent2 = this.entities[ent2Key];
                    if (ent1.doesCollide(ent2))
                    {
                        ent1.handleCollision(ent2);
                        ent2.handleCollision(ent1);
                    }
                }
            }
        }
    }
}

