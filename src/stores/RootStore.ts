import FileExplorerStore from "./FileExplorerStore";
import UIStore from "./UIStore";

export default class RootStore {
  fileExplorerStore: FileExplorerStore;

  uiStore: UIStore;

  constructor() {
    this.fileExplorerStore = new FileExplorerStore(this);
    this.uiStore = new UIStore(this);
  }
}
