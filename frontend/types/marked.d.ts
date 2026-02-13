declare module 'marked' {
  export function marked(src: string): string
  export namespace marked {
    function setOptions(options: { breaks?: boolean; gfm?: boolean }): void
    function parse(src: string): string
  }
}
