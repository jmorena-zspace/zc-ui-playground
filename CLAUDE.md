# zc-ui-playground

## Don't add unnecessary UI

**When asked to put a component on a page, render exactly that component and
nothing else.** This is a playground for looking at components behaving the way
they do in production — it is not documentation.

Do not add, unless explicitly asked:

- Explanatory copy: headings, descriptions, captions, prose about what the
  component is or which states to try. The component speaks for itself.
- A gallery of variants. One interactive instance, not one per prop
  combination. If a prop matters, make it reachable through interaction.
- Section wrappers, labels, prop tables, state legends, or code samples.

What a component page contains: a back button to the main page, and the
component. That is all.

When a requested behavior does not exist on the vendored component, add it to
the component rather than staging it from the page — the point is that the
component behaves like production, not that the page fakes it.

## Everything else

See README.md for the stack, the alias/stand-in layout under `src/stubs/`, and
how to port another component out of the zCentral app.
