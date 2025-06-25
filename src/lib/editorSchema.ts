import { MarkSpec, NodeSpec, Schema } from 'prosemirror-model';
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

const mentionNode: NodeSpec = {
  inline: true,
  group: 'inline',
  selectable: false,
  atom: true,
  attrs: { id: {}, type: {}, label: {} },
  toDOM(node) {
    const { id, type, label } = node.attrs as any;
    return [
      'span',
      {
        'data-id': id,
        'data-type': type,
        class: 'mention',
      },
      `@${label}`,
    ];
  },
  parseDOM: [
    {
      tag: 'span[data-id][data-type]',
      getAttrs(dom: HTMLElement) {
        return {
          id: dom.getAttribute('data-id'),
          type: dom.getAttribute('data-type'),
          label: dom.textContent?.replace(/^@/, '') ?? '',
        };
      },
    },
  ],
};

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
  parseDOM: [
    {
      style: 'font-family',
      getAttrs: (value: string) => ({ name: value }),
    },
  ],
  toDOM: (mark: any) => [
    'span',
    { style: `font-family:${mark.attrs.name}` },
    0,
  ],
};

const underlineMark: MarkSpec = {
  parseDOM: [
    { tag: 'u' },
    { style: 'text-decoration=underline' },
  ],
  toDOM: () => ['span', { style: 'text-decoration:underline' }, 0],
};

const strikeMark: MarkSpec = {
  parseDOM: [
    { tag: 's' },
    { style: 'text-decoration=line-through' },
  ],
  toDOM: () => ['span', { style: 'text-decoration:line-through' }, 0],
};

export const editorSchema = new Schema({
  nodes: nodes.addToEnd('mention', mentionNode),
  marks: basic.spec.marks
    .addToEnd('color', colorMark)
    .addToEnd('font', fontMark)
    .addToEnd('underline', underlineMark)
    .addToEnd('strike', strikeMark),
});
