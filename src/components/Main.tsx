import DirectoryItemListBox from "./DirectoryItemListBox";
import FileImportMessage from "./FileImportMessage";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import RootDirectoryItemList from "./RootDirectoryItemList";

const Main = () => {
  return (
    <main>
      <LeftPanel>
        <FileImportMessage />
        <RootDirectoryItemList />
      </LeftPanel>
      <RightPanel>
        <DirectoryItemListBox />
      </RightPanel>
    </main>
  );
};

export default Main;
