import { useContext } from "react";
import { observer } from "mobx-react-lite";
import importIcon from "../assets/ic-import-icon.svg";
import StoreContext from "../contexts/StoreContext";

const FileImportMessage = () => {
  const rootStore = useContext(StoreContext);
  const finderStore = rootStore?.finderStore;
  const importedFile = finderStore?.importedFile;

  return !importedFile ? (
    <div className="file-import-message">
      <img src={importIcon} className="import-icon" alt="import-icon" />
      <p className="import-icon-text">
        Click Import button to load a localization file.
      </p>
    </div>
  ) : null;
};

export default observer(FileImportMessage);
