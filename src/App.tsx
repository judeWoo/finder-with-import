import "./App.css";
import Gnb from "./components/Gnb";
import Main from "./components/Main";
import ImportErrorPopup from "./components/ImportErrorPopup";
import RootStore from "./stores/RootStore";
import StoreContext from "./contexts/StoreContext";

const App = () => {
  const rootStore = new RootStore();

  return (
    <StoreContext.Provider value={rootStore}>
      <Gnb />
      <Main />
      <ImportErrorPopup />
    </StoreContext.Provider>
  );
};

export default App;
