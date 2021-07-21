import { makeAutoObservable } from "mobx";
import CustomObject from "../interfaces/DirectoryMap";
import Directory from "../interfaces/Directory";
import ImportedFile from "../interfaces/ImportedFile";
import RootStore from "./RootStore";

export default class FinderStore {
  processing = false;

  selectedItemByDepth: CustomObject = {};

  rootStore: RootStore;

  directory: Directory | undefined;

  importedFile: ImportedFile | undefined;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {
      directory: false,
      rootStore: false,
    });
    this.rootStore = rootStore;
  }

  clear() {
    this.selectedItemByDepth = {};
    this.directory = { items: [] };
    this.rootStore.uiStore.clear();
  }

  isValidImportedFile(input: JSON) {
    if (!input) {
      return false;
    }

    if (JSON.stringify(input).slice(1).indexOf("{") >= 0) {
      return false;
    }

    if (JSON.stringify(input).indexOf("[") >= 0) {
      return false;
    }

    return true;
  }

  processImportedFile() {
    if (!this.importedFile) {
      return;
    }

    this.clear();

    this.processing = true;

    Object.keys(this.importedFile).forEach((key) => {
      const fileContent = this.importedFile
        ? this.importedFile[key].toString()
        : null;
      const folderOrFileArray = key.split(".");
      let items = this.directory ? this.directory.items : [];

      if (
        folderOrFileArray.length === 0 ||
        folderOrFileArray.some((item) => !item)
      ) {
        throw new Error("No Folder or File");
      }

      folderOrFileArray.forEach((folderOrFile, index) => {
        const directoryModel: Directory = {
          content: null,
          path: null,
          label: folderOrFile,
          depth: index,
          items: [],
        };
        const found = items.find(
          (item: Directory) => item.label === folderOrFile
        );

        if (!found) {
          items.push(directoryModel);
          items = directoryModel.items;
        } else {
          items = found.items;
        }

        if (index === folderOrFileArray.length - 1 && !found) {
          directoryModel.content = fileContent;
          directoryModel.path = key;
        } else if (index === folderOrFileArray.length - 1 && found) {
          found.content = fileContent;
          found.path = key;
        }
      });
    });

    this.processing = false;
  }

  setImportedFile(importedFile: ImportedFile | undefined) {
    this.importedFile = importedFile;
  }

  setSelectedItemByDepth(item: Directory | undefined) {
    Object.keys(this.selectedItemByDepth).forEach((key) => {
      if (Number(key) >= (item?.depth || "")) {
        this.selectedItemByDepth[key] = undefined;
      }
    });

    this.selectedItemByDepth[item?.depth || ""] = item;
  }
}
