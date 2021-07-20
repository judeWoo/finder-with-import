import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { v4 as uuid } from "uuid";
import Directory from "../interfaces/Directory";
import DirectoryItem from "./DirectoryItem";
import useResize from "../hooks/useResize";
import StoreContext from "../contexts/StoreContext";

type Props = {
  depth?: number;
  items?: Array<Directory>;
};

const DirectoryItemList = ({ depth = 0, items }: Props) => {
  const rootStore = useContext(StoreContext);
  const uiStore = rootStore?.uiStore;
  const widthByDepth = uiStore?.widthByDepth;
  const setWidthByDepth = uiStore?.setWidthByDepth;
  const { onMouseDown, hrRef, listRef } = useResize(depth, setWidthByDepth);

  return items && items.length > 0 ? (
    <ul
      className="directory-item-list sub-list"
      ref={listRef}
      style={widthByDepth && widthByDepth[depth] ? { width: `${widthByDepth[depth]}px` } : undefined}
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

export default observer(DirectoryItemList);
