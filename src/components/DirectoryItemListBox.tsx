import { useContext } from "react";
import { action, toJS } from "mobx";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import DirectoryItemList from "./DirectoryItemList";
import FileContent from "./FileContent";
import StoreContext from "../contexts/StoreContext";

const DirectoryItemListBox = () => {
  const rootStore = useContext(StoreContext);
  const fileExplorerStore = rootStore?.fileExplorerStore;
  const selectedItemByItemDepth =
    fileExplorerStore?.selectedItemByItemDepth || {};
  const sorted = Object.keys(toJS(selectedItemByItemDepth)).sort(
    (a, b) => Number(a) - Number(b)
  );

  return sorted.length > 0 ? (
    <>
      {sorted.map(
        action((key) => {
          const { content, path, items } = selectedItemByItemDepth[key] || {};
          return content && path ? (
            <FileContent key={uuid()} content={content} path={path} />
          ) : (
            <DirectoryItemList key={uuid()} items={items} />
          );
        })
      )}
    </>
  ) : null;
};

export default observer(DirectoryItemListBox);
