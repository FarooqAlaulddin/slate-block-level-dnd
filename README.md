# SlateJS React - Block-Level Drag-and-Drop with Smooth Animation (CSS & JS Only)
This is a quick demo of block-level drag-and-drop in a Slate.js editor, based on [Slate rich text example](https://github.com/ianstormtaylor/slate/blob/main/site/examples/richtext.tsx), but with added drag-and-drop and smooth block animation.

![dnd-slate](https://github.com/user-attachments/assets/86810e1c-8da3-4dc4-87bd-4d040db06db3)

### What's Happening:
- **Drag and Drop (Block-Level Only)**: This implementation supports **block-level** drag and drop. It doesn't handle nested elements like list items or blocks within blocks. The block movement is managed using `Transforms.moveNodes()` at the root block level, which means only top-level blocks are re-ordered. You can see the relevant code for moving the blocks [here](https://github.com/FarooqAlaulddin/slate-block-level-dnd/blob/main/src/App.js#L58).

- **Block Animation**: After a block is moved, the positions of all blocks are recalculated, and if a block has shifted, it animates with a smooth `translateY` transition. This gives users visual feedback on where the block was dropped.

For live demo, see [codesandbox](https://codesandbox.io/p/sandbox/react-compiler-forked-jrl5hq)

That’s it.. basic drag-and-drop with a nice and simple block animation to keep you from using expensive ui libraries.
