import { useContext, useEffect } from "react";
import { action } from "mobx";
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
  const onKeyDown = action("onKeyDown", (e: KeyboardEvent) => {
    e.stopPropagation();
    switch (e.key) {
      case "Down":
      case "ArrowDown":
        if (!uiStore?.selectedLabel) {
          const listItem = document.querySelector("li.directory-item");
          if (listItem instanceof HTMLElement) {
            listItem.click();
            listItem.focus();
          }
        } else {
          const selectedListItem = document.querySelector(
            "li.directory-item.selected"
          );
          const nextElementSibling = selectedListItem?.nextElementSibling;
          if (nextElementSibling instanceof HTMLElement) {
            nextElementSibling.click();
            nextElementSibling.focus();
          }
        }
        break;
      case "Up":
      case "ArrowUp":
        if (!uiStore?.selectedLabel) {
          const listItems = document.querySelectorAll("li.directory-item");
          const listItem = listItems[listItems.length - 1];
          if (listItem instanceof HTMLElement) {
            listItem.click();
            listItem.focus();
          }
        } else {
          const selectedListItem = document.querySelector(
            "li.directory-item.selected"
          );
          const previousElementSibling =
            selectedListItem?.previousElementSibling;
          if (previousElementSibling instanceof HTMLElement) {
            previousElementSibling.click();
            previousElementSibling.focus();
          }
        }
        break;
      case "Left":
      case "ArrowLeft":
        if (uiStore?.selectedLabel) {
          const activeListItems = document.querySelectorAll(
            "li.directory-item.active:not(.selected)"
          );
          const lastActiveListItem =
            activeListItems[activeListItems.length - 1];

          if (lastActiveListItem instanceof HTMLElement) {
            lastActiveListItem.click();
            lastActiveListItem.focus();
          }
        }
        break;
      case "Right":
      case "ArrowRight":
        if (uiStore?.selectedLabel) {
          const selectedListItem = document.querySelector(
            "li.directory-item.selected"
          );
          const list = selectedListItem?.parentElement;
          const nextElementSibling = list?.nextElementSibling;

          if (nextElementSibling) {
            const targetListItem = nextElementSibling.firstElementChild;

            if (targetListItem instanceof HTMLElement) {
              targetListItem.click();
              targetListItem.focus();
            }
          } else {
            const subList = document.querySelector(
              "ul.directory-item-list.sub-list"
            );
            const targetListItem = subList?.firstElementChild;

            if (targetListItem instanceof HTMLElement) {
              targetListItem.click();
              targetListItem.focus();
            }
          }
        }
        break;
      default:
        return;
    }
  });

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown, false);
    return () => {
      document.removeEventListener("keydown", onKeyDown, false);
    };
  }, [onKeyDown]);

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
