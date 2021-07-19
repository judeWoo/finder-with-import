type Props = {
  children?: React.ReactNode;
};

const LeftPanel = ({ children }: Props) => {
  return <div className="left-panel">{children}</div>;
};

export default LeftPanel;
