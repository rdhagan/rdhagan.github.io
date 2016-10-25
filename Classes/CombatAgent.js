
function CombatAgent(ent) {
    this.entity = ent;
    this.actionIntervalMs = 0;
    // actions are functions that take an entity parameter
    this.action = null;
    this.tapAction = null;
    this.slingshotAction = null;
    var that = this;

    this.start = function() {
        var that = this;
    	if (this.actionIntervalMs > 0 && this.action != null) {
            setTimeout(this.doAction, this.actionIntervalMs);
        }
    }
    this.doAction = function() {
        if (!that.entity.destroyed) {
            that.action.run(that.entity);
            setTimeout(that.doAction, that.actionIntervalMs);
        }
    }
    this.clone = function() {
        var agent = new CombatAgent();
        agent.actionIntervalMs = this.actionIntervalMs;
        agent.action = this.action;
        agent.tapAction = this.tapAction;
        agent.slingshotAction = this.slingshotAction;
    }
}
