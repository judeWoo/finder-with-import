import { useCallback, useContext } from "react";
import clsx from "clsx";
import { observer } from "mobx-react-lite";
import StoreContext from "../contexts/StoreContext";

type Props = {
  children?: React.ReactNode;
};

const ImportErrorPopup = ({ children }: Props) => {
  const rootStore = useContext(StoreContext);
  const uiStore = rootStore?.uiStore;
  const isImportErrorPopupActive = uiStore?.isImportErrorPopupActive;
  const onClick = useCallback(() => {
    if (uiStore) {
      uiStore.setisImportErrorPopupActive(false);
    }
  }, [uiStore]);

  return isImportErrorPopupActive ? (
    <>
      <div className={clsx({ popup: true, active: isImportErrorPopupActive })}>
        {children}
        <p className="popup-headline">Import Error</p>
        <p className="popup-content">The file is not a valid JSON file</p>
        <button className="popup-button" onClick={onClick}>
          OK
        </button>
      </div>
      <div
        className={clsx({
          "popup-shadow": true,
          active: isImportErrorPopupActive,
        })}
      ></div>
    </>
  ) : null;
};

export default observer(ImportErrorPopup);
