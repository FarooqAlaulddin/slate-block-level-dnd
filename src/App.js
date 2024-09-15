import React, { useCallback, useMemo } from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, useSlate, Slate, ReactEditor } from "slate-react";
import { Transforms, createEditor, Element as SlateElement } from "slate";
import { withHistory } from "slate-history";

const randomHexColor = () => {
  const r = Math.floor(Math.random() * 100); // Limit red to lower values
  const g = Math.floor(Math.random() * 100); // Limit green to lower values
  const b = Math.floor(Math.random() * 100); // Limit blue to lower values
  return `rgb(${r}, ${g}, ${b})`;
};

// Function to get all block elements and their positions
const getBlockPositions = () => {
  const blocks = document.querySelectorAll('[data-slate-node="element"]');
  return Array.from(blocks).map((block, index) => ({
    el: block,
    rect: block.getBoundingClientRect(),
    index,
  }));
};

// Function to animate the shift
const animateShift = (element, startY, endY) => {
  element.style.transition = "none";
  element.style.transform = `translateY(${startY - endY}px)`;

  // Force a reflow
  element.offsetHeight;

  element.style.transition = "transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)";
  element.style.transform = "translateY(0)";
};

const App = () => {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        onDrop={(e) => {
          e.persist();
          e.preventDefault();

          const initialPositions = getBlockPositions();

          // setTimeout(() => {
          const Range = ReactEditor.findEventRange(editor, e);
          console.log(Range);
          Transforms.moveNodes(editor, {
            at: editor.selection,
            to: [Range.anchor.path[0]],
            mode: "highest",
          });
          // }, 0);

          setTimeout(() => {
            const finalPositions = getBlockPositions();
            finalPositions.forEach((final, currentIndex) => {
              const initial = initialPositions.find(
                (pos) => pos.el === final.el
              );
              if (initial && initial.index !== currentIndex) {
                const yDiff = initial.rect.top - final.rect.top;
                if (Math.abs(yDiff) > 1) {
                  // Threshold to avoid unnecessary animations
                  animateShift(final.el, yDiff, 0);
                }
              }
            });
          }, 0);
        }}
      />
    </Slate>
  );
};

const Element = ({ attributes, children, element }) => {
  const style = {
    background: element.bg || "#a19840c",
    color: "white",
    padding: "15px",
    margin: "10px",
    fontSize: "18px",
    borderRadius: "10px",
  };
  switch (element.type) {
    case "block-quote":
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const initialValue = [
  {
    type: "paragraph",
    bg: randomHexColor(),
    children: [
      {
        text: "Block 1",
      },
    ],
  },
  {
    type: "paragraph",
    bg: randomHexColor(),
    children: [
      {
        text: "Block 2",
      },
    ],
  },
  {
    type: "paragraph",
    bg: randomHexColor(),
    children: [
      {
        text: "Block 3",
      },
    ],
  },
  {
    type: "paragraph",
    bg: randomHexColor(),
    children: [
      {
        text: "Block 4",
      },
    ],
  },
];

export default App;
