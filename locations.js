"use strict";
// The location registry is the only place that lists location layers and solids.
// A location is a view inside the shared Phaser scene; phase still tracks story flow.
Object.assign(ClearToClose.prototype, {
  registerLocation(name, definition) {
    this.locations ??= new Map();
    if (this.locations.has(name)) throw new Error(`Duplicate location: ${name}`);
    this.locations.set(name, definition);
  },

  registerLocations() {
    this.locations = new Map();
    this.registerLocation("apartment", {
      layer: () => this.worldLayer, groups: () => [this.barriers], items: () => this.items
    });
    this.registerLocation("office", {
      layer: () => this.officeLayer, groups: () => [this.officeBarriers], items: () => this.officeItems,
      activate: () => this.setWhiteboardVisible(this.officeStage >= 1 && this.whiteboardDeliveryDone)
    });
    this.registerLocation("town", {
      layer: () => this.townLayer, groups: () => [this.townBarriers], items: () => this.townItems
    });
    this.registerLocation("downtown", {
      layer: () => this.downtownLayer, groups: () => [this.downtownBarriers], items: () => this.downtownItems,
      activate: () => {
        this.daveBarrier.body.enable = this.daveIntroSeen;
        this.tourAgentBarrier.body.enable = this.tourAgentReady && !this.offerAgentInside;
      }
    });
    this.registerLocation("realtorOffice", {
      layer: () => this.realtorLayer, groups: () => [this.realtorBarriers], items: () => this.realtorItems
    });
    this.registerLocation("showingStreet", {
      layer: () => this.showingStreetLayer,
      groups: () => this.showingStreetBarriersByIndex,
      activeGroups: () => [this.showingStreetBarriers], items: () => this.showingStreetItems
    });
    this.registerLocation("showingHome", {
      layer: () => this.showingHomeLayer, layers: () => this.showingHomeLayers,
      groups: () => this.showingHomeBarriersByIndex,
      activeGroups: () => [this.showingHomeBarriers], items: () => this.showingHomeItems
    });
    this.registerLocation("closingStreet", {
      layer: () => this.closingStreetLayer, groups: () => [this.closingStreetBarriers], items: () => []
    });
    this.registerLocation("closingRoom", {
      layer: () => this.closingRoomLayer, groups: () => [this.closingRoomBarriers], items: () => this.closingRoomItems
    });
  },

  switchLocation(name) {
    const target = name === null ? null : this.locations.get(name);
    // Validate before changing anything; a misspelling must not blank the game.
    if (name !== null && !target) throw new Error(`Unknown location: ${name}`);
    for (const location of this.locations.values()) {
      for (const layer of location.layers?.() || [location.layer()]) layer.setVisible(false);
      for (const group of location.groups()) {
        group.children.iterate(object => { if (object?.body) object.body.enable = false; });
      }
    }
    this.currentLocation = name;
    this.player.setVelocity(0);
    this.mobile.set(0, 0);
    this.near = null;
    this.dialogue = false;
    this._cb = null;
    // Clear shared transient UI without running a dismissed dialogue callback.
    for (const key of ["prompt", "spark", "box", "portrait", "face", "loAvatar", "agentAvatar", "text",
      "notice", "docHud", "loanBoard", "realtorConsultUI", "teamChatUI"])
      this[key]?.setVisible(false);
    if (!target) return;
    for (const group of target.activeGroups?.() || target.groups()) {
      group.children.iterate(object => { if (object?.body) object.body.enable = true; });
    }
    const layer = target.layer();
    layer.add(this.player);
    layer.bringToTop(this.player);
    layer.setVisible(true);
    target.activate?.();
    // Spawn positions, phase, player visibility/body state and story progression
    // belong to the caller, preserving seating, entrances and cinematic timing.
  }
});
