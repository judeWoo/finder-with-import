import { v4 as uuid } from "uuid";
import Directory from "../interfaces/Directory";
import DirectoryItem from "./DirectoryItem";
import useResize from "../hooks/useResize";

type Props = {
  items?: Array<Directory>;
};

const DirectoryItemList = ({ items }: Props) => {
  const { onMouseDown, hrRef, listRef } = useResize();

  return items && items.length > 0 ? (
    <ul className="directory-item-list sub-list" ref={listRef}>
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

export default DirectoryItemList;
