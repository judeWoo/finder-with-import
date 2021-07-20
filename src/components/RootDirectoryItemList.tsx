import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { v4 as uuid } from "uuid";
import DirectoryItem from "./DirectoryItem";
import StoreContext from "../contexts/StoreContext";
import useResize from "../hooks/useResize";

const RootDirectoryItemList = () => {
  const rootStore = useContext(StoreContext);
  const fileExplorerStore = rootStore?.fileExplorerStore;
  const importedFile = fileExplorerStore?.importedFile;
  const processing = fileExplorerStore?.processing;
  const directory = fileExplorerStore?.directory;
  const { items } = directory || { items: [] };
  const uiStore = rootStore?.uiStore;
  const widthByDepth = uiStore?.widthByDepth;
  const setWidthByDepth = uiStore?.setWidthByDepth;
  const { onMouseDown, hrRef, listRef } = useResize(0, setWidthByDepth);

  return !processing && importedFile && directory ? (
    <ul
      className="directory-item-list"
      ref={listRef}
      style={
        widthByDepth && widthByDepth[0]
          ? { width: `${widthByDepth[0]}px` }
          : undefined
      }
    >
      {items
        .filter((item) => !item.content)
        .sort((item1, item2) => {
          const item1Label = item1.label || "";
          const item2Label = item2.label || "";
          if (item1Label < item2Label) {
            return -1;
          }
          if (item1Label > item2Label) {
            return 1;
          }

          return 0;
        })
        .map((item) => (
          <DirectoryItem key={uuid()} item={item} />
        ))}
      {items
        .filter((item) => item.content)
        .sort((item1, item2) => {
          const item1Label = item1.label || "";
          const item2Label = item2.label || "";
          if (item1Label < item2Label) {
            return -1;
          }
          if (item1Label > item2Label) {
            return 1;
          }

          return 0;
        })
        .map((item) => (
          <DirectoryItem key={uuid()} item={item} />
        ))}
      <hr ref={hrRef} onMouseDown={onMouseDown} />
    </ul>
  ) : null;
};

export default observer(RootDirectoryItemList);
