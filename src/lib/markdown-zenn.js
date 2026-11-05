import { defineMdastPlugin } from 'satteri'

// Lets posts written for Zenn render the same way here, so one manuscript works on both.

// Zenn turns every newline inside a paragraph into a line break; plain Markdown joins
// the lines (and in Japanese leaves a stray space at the seam).
export const zennLineBreaks = defineMdastPlugin({
  name: 'zenn-line-breaks',
  text(node, ctx) {
    if (!node.value.includes('\n')) return
    const parts = node.value.split('\n').flatMap((value, i) => [
      ...(i > 0 ? [{ type: 'break' }] : []),
      ...(value ? [{ type: 'text', value }] : []),
    ])
    ctx.replaceNode(node, parts)
  },
})

function escape(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
}

// The directive parser keeps only the name of `:::message alert` / `:::details Title`,
// so the rest of each opening line is read back from the source. Directives are
// visited in document order, which lines them up with the openers found here.
function openers(source) {
  const withoutCode = source.replace(/^(```|~~~)[\s\S]*?^\1/gm, '')
  return [...withoutCode.matchAll(/^:{3,}([\w-]+)[ \t]*(.*)$/gm)].map(([, name, rest]) => ({ name, rest: rest.trim() }))
}

// :::message / :::message alert become a callout box, :::details Title a <details>
export const zennBlocks = defineMdastPlugin({
  name: 'zenn-blocks',
  containerDirective(node, ctx) {
    ctx.data.zennOpeners ??= openers(ctx.source)
    ctx.data.zennIndex ??= 0
    const opener = ctx.data.zennOpeners[ctx.data.zennIndex++] ?? { name: node.name, rest: '' }

    let open
    let close
    if (node.name === 'message') {
      const kind = opener.rest === 'alert' ? 'alert' : 'info'
      open = `<aside class="zenn-message zenn-message-${kind}" role="note">`
      close = '</aside>'
    } else if (node.name === 'details') {
      open = `<details class="zenn-details"><summary>${escape(opener.rest || '詳細')}</summary>`
      close = '</details>'
    } else {
      return
    }
    ctx.replaceNode(node, [{ type: 'html', value: open }, ...node.children, { type: 'html', value: close }])
  },
})
