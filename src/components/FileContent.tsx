type Props = {
  depth?: number;
  content?: string;
  path?: string | null;
};

const FileContent = ({ content, path }: Props) => {
  return (
    <div className="file-content-box">
      <div className="file-content">{content}</div>
      <div className="file-content-text">{path}</div>
    </div>
  );
};

export default FileContent;
