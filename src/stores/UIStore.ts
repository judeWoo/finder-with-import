import { action, makeAutoObservable, makeObservable } from "mobx";
import RootStore from "./RootStore";

type UIStoreObjectProps = {
  [key: string]: string | number;
};

export default class UIStore {
  rootStore: RootStore;

  isImportErrorPopupActive = false;

  activeItemLabelByDepth: UIStoreObjectProps = {};

  widthByDepth: UIStoreObjectProps = {};

  selectedLabel = "";

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, { rootStore: false, setWidthByDepth: false });
    makeObservable(this, {
      setWidthByDepth: action.bound,
    });
    this.rootStore = rootStore;
  }

  clear() {
    this.isImportErrorPopupActive = false;
    this.activeItemLabelByDepth = {};
    this.widthByDepth = {};
    this.selectedLabel = "";
  }

  setisImportErrorPopupActive(isImportErrorPopupActive: boolean) {
    this.isImportErrorPopupActive = isImportErrorPopupActive;
  }

  setActiveItemLabelByDepth(depth: number, label: string) {
    Object.keys(this.activeItemLabelByDepth).forEach((key) => {
      if (Number(key) >= depth) {
        this.activeItemLabelByDepth[key] = "";
      }
    });

    Object.keys(this.widthByDepth).forEach((key) => {
      if (Number(key) > depth) {
        this.widthByDepth[key] = 0;
      }
    });

    this.activeItemLabelByDepth[depth] = label;
  }

  setWidthByDepth(depth: number, width: number) {
    this.widthByDepth[depth] = width;
  }

  setSelectedLabel(label: string) {
    this.selectedLabel = label;
  }
}
