import React, { useCallback, useEffect, useRef } from "react";

const minWidth = 240;

const useResize = () => {
  const listRef = useRef<HTMLUListElement>(null);
  const hrRef = useRef<HTMLHRElement>(null);
  const m_pos = useRef(0);

  const resize = useCallback(
    (e) => {
      if (hrRef && hrRef.current && listRef && listRef.current) {
        const dx =
          e.x < hrRef.current.offsetLeft &&
          e.x <= listRef.current.offsetLeft + minWidth &&
          hrRef.current.offsetLeft <= listRef.current.offsetLeft + minWidth
            ? 0
            : e.x - m_pos.current;
        m_pos.current = e.x;
        listRef.current.style.width =
          parseInt(getComputedStyle(listRef.current, "").width, 10) + dx + "px";
      }
    },
    [m_pos, hrRef, listRef]
  );
  const onMouseDown = useCallback(
    (event: React.MouseEvent<HTMLHRElement>) => {
      m_pos.current = event.nativeEvent.x;
      document.getElementsByTagName("body")[0].classList.add("resizable");
      document.addEventListener("mousemove", resize, false);
    },
    [m_pos, resize]
  );

  useEffect(() => {
    const handleMouseup = () => {
      document.getElementsByTagName("body")[0].classList.remove("resizable");
      document.removeEventListener("mousemove", resize, false);
    };

    document.addEventListener("mouseup", handleMouseup, false);

    return () => {
      document.removeEventListener("mouseup", handleMouseup, false);
    };
  }, [resize]);

  return { onMouseDown, hrRef, listRef };
};

export default useResize;
