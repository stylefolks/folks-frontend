import {keymap} from "prosemirror-keymap"
import {history} from "prosemirror-history"
import {baseKeymap} from "prosemirror-commands"
import {Plugin} from "prosemirror-state"
import {dropCursor} from "prosemirror-dropcursor"
import {gapCursor} from "prosemirror-gapcursor"
import {menuBar, MenuElement} from "prosemirror-menu"
import {Schema} from "prosemirror-model"

import {buildMenuItems} from "./menu"
import {buildKeymap} from "./keymap"
import {buildInputRules} from "./inputrules"
import { getFolksMentionPlugin } from "@/lib/plugins/mentionPlugin"
import { fetchCrews } from "@/lib/crew"
import { searchUsers } from "@/lib/user"

export {buildMenuItems, buildKeymap, buildInputRules}

/// Create an array of plugins pre-configured for the given schema.
/// The resulting array will include the following plugins:
///
///  * Input rules for smart quotes and creating the block types in the
///    schema using markdown conventions (say `"> "` to create a
///    blockquote)
///
///  * A keymap that defines keys to create and manipulate the nodes in the
///    schema
///
///  * A keymap binding the default keys provided by the
///    prosemirror-commands module
///
///  * The undo history plugin
///
///  * The drop cursor plugin
///
///  * The gap cursor plugin
///
///  * A custom plugin that adds a `menuContent` prop for the
///    prosemirror-menu wrapper, and a CSS class that enables the
///    additional styling defined in `style/style.css` in this package
///
/// Probably only useful for quickly setting up a passable
/// editor—you'll need more control over your settings in most
/// real-world situations.
export function setup(options: {
  /// The schema to generate key bindings and menu items for.
  schema: Schema

  /// Can be used to [adjust](#example-setup.buildKeymap) the key bindings created.
  mapKeys?: {[key: string]: string | false}

  /// Set to false to disable the menu bar.
  menuBar?: boolean

  /// Set to false to disable the history plugin.
  history?: boolean

  /// Set to false to make the menu bar non-floating.
  floatingMenu?: boolean

  /// Can be used to override the menu content.
  menuContent?: MenuElement[][]
}) {
  let plugins = [
    getFolksMentionPlugin({
      getSuggestions: async (type, text, done) => {
        try {
          const [crews, users] = await Promise.all([
            fetchCrews({ search: text, limit: '5' }),
            searchUsers({ search: text, limit: '5' }),
          ]);
          const crewItems = crews.map((c) => ({ id: c.id, name: c.name, type: 'crew' }));
          const userItems = users.map((u) => ({ id: u.userId, name: u.username, type: 'user' }));
          done([...crewItems, ...userItems]);
        } catch {
          done([]);
        }
      },
      getSuggestionsHTML: (items) =>
        `<div class="suggestion-item-list">${items
          .map((i) => `<div class="suggestion-item">${i.name}</div>`)
          .join('')}</div>`,
    }),
    buildInputRules(options.schema),
    keymap(buildKeymap(options.schema, options.mapKeys)),
    keymap(baseKeymap),
    dropCursor(),
    gapCursor()
  ]
  if (options.menuBar !== false)
    plugins.push(menuBar({floating: options.floatingMenu !== false,
                          content: options.menuContent || buildMenuItems(options.schema).fullMenu}))
  if (options.history !== false)
    plugins.push(history())

  return plugins.concat(new Plugin({
    props: {
      attributes: {class: "ProseMirror-example-setup-style"}
    }
  }))
}