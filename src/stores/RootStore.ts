import FinderStore from "./FinderStore";
import UIStore from "./UIStore";

export default class RootStore {
  finderStore: FinderStore;

  uiStore: UIStore;

  constructor() {
    this.finderStore = new FinderStore(this);
    this.uiStore = new UIStore(this);
  }
}
