type Props = {
  children?: React.ReactNode;
};

const RightPanel = ({ children }: Props) => {
  return <div className="right-panel">{children}</div>;
};

export default RightPanel;
