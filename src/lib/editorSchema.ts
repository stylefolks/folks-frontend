import { MarkSpec, Schema } from 'prosemirror-model';
import { schema as basic } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';

const baseNodes = addListNodes(
  basic.spec.nodes,
  'paragraph block*',
  'block'
);

const nodes = baseNodes.update('paragraph', {
  ...baseNodes.get('paragraph')!,
  attrs: { indent: { default: 0 } },
  toDOM(node) {
    const { indent } = node.attrs as any;
    const attrs: any = {};
    if (indent) attrs.style = `margin-left: ${indent * 2}em`;
    return ['p', attrs, 0];
  },
  parseDOM: [{
    tag: 'p',
    getAttrs(dom: HTMLElement) {
      const ml = dom.style.marginLeft;
      return { indent: ml ? parseInt(ml) / 2 : 0 };
    },
  }],
});

const colorMark: MarkSpec = {
  attrs: { color: {} },
  parseDOM: [{
    style: 'color',
    getAttrs: (value: string) => ({ color: value }),
  }],
  toDOM: (mark: any) => ['span', { style: `color:${mark.attrs.color}` }, 0],
};

const fontMark: MarkSpec = {
  attrs: { name: {} },
  parseDOM: [{
    style: 'font-family',
    getAttrs: (value: string) => ({ name: value }),
  }],
  toDOM: (mark: any) => [
    'span',
    { style: `font-family:${mark.attrs.name}` },
    0,
  ],
};

export const editorSchema = new Schema({
  nodes,
  marks: basic.spec.marks.addToEnd('color', colorMark).addToEnd('font', fontMark),
});
