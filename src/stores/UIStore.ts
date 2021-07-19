import { makeAutoObservable } from "mobx";
import RootStore from "./RootStore";

type UIStoreObjectProps = {
  [key: string]: string | number;
};

export default class UIStore {
  rootStore: RootStore;

  isImportErrorPopupActive = false;

  activeStateByItemLabel: UIStoreObjectProps = {};

  widthByDepth: UIStoreObjectProps = {};

  selectedLabel = "";

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, { rootStore: false, widthByDepth: false });
    this.rootStore = rootStore;
  }

  clear() {
    this.isImportErrorPopupActive = false;
    this.activeStateByItemLabel = {};
    this.selectedLabel = "";
  }

  setisImportErrorPopupActive(isImportErrorPopupActive: boolean) {
    this.isImportErrorPopupActive = isImportErrorPopupActive;
  }

  setActiveStateByItemLabel(depth: number, label: string) {
    Object.keys(this.activeStateByItemLabel).forEach((key) => {
      if (Number(key) >= depth) {
        this.activeStateByItemLabel[key] = "";
      }
    });

    this.activeStateByItemLabel[depth] = label;
  }

  setWidthByDepth(depth: number, width: number) {
    this.widthByDepth[depth] = width;
  }

  setSelectedLabel(label: string) {
    this.selectedLabel = label;
  }
}
