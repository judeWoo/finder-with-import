interface Directory {
  depth?: number;
  content?: string | null;
  path?: string | null;
  label?: string;
  items: Array<Directory>;
}

export default Directory;
