import { useCallback, useContext, useRef } from "react";
import importIcon from "../assets/ic-import.svg";
import StoreContext from "../contexts/StoreContext";

const ImportButton = () => {
  const rootStore = useContext(StoreContext);
  const fileExplorerStore = rootStore?.fileExplorerStore;
  const uiStore = rootStore?.uiStore;
  const fileElemRef = useRef<HTMLInputElement>(null);
  const onClick = useCallback(() => {
    if (fileElemRef.current) {
      fileElemRef.current.click();
    }
  }, [fileElemRef]);
  const onChange = useCallback(
    (e: { target: HTMLInputElement }) => {
      if (!e.target.files || !uiStore || !fileExplorerStore) return;

      const fileList = e.target.files;
      const file = fileList[0];

      if (file && file.type !== "application/json") {
        fileExplorerStore.setImportedFile(undefined);
        fileExplorerStore.clear();
        uiStore.setisImportErrorPopupActive(true);
        return;
      }

      if (file) {
        file
          .text()
          .then((text) => {
            try {
              const input = JSON.parse(text);

              if (!fileExplorerStore.isValidImportedFile(input)) {
                fileExplorerStore.setImportedFile(undefined);
                fileExplorerStore.clear();
                uiStore.setisImportErrorPopupActive(true);
                return;
              } else {
                fileExplorerStore.setImportedFile(input);
                fileExplorerStore.processImportedFile();
              }
            } catch (error) {
              fileExplorerStore.setImportedFile(undefined);
              fileExplorerStore.clear();
              uiStore.setisImportErrorPopupActive(true);
              return;
            }
          })
          .catch(() => {
            fileExplorerStore.setImportedFile(undefined);
            fileExplorerStore.clear();
            uiStore.setisImportErrorPopupActive(true);
            return;
          });
      }
    },
    [fileExplorerStore, uiStore]
  );

  return (
    <>
      <button className="import-button" onClick={onClick}>
        Import
        <img src={importIcon} className="ic-import" alt="import-icon" />
      </button>
      {/* Hidden input element for file upload */}
      <input
        type="file"
        ref={fileElemRef}
        className="hidden"
        onChange={onChange}
      />
    </>
  );
};

export default ImportButton;
