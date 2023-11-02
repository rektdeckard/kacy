import { match, P } from "ts-pattern";

export function getKeyRepresentation(name: string): string {
  switch (name) {
  }
  return (
    match(name)
      .with("Up", () => "↑")
      .with("Down", () => "↓")
      .with("Left", () => "←")
      .with("Right", () => "→")
      .with("Enter", () => "↵")
      .with("BackSpace", () => "⌫")
      .with("Delete", () => "⌦")
      .with("LeftShift", "RightShift", () => "⇧")
      .with("LeftControl", "RightControl", () => "^")
      .with("LeftAlt", "RightAlt", "LeftOption", "RightOption", () => "⎇")
      .with("LeftWindows", "RightWindows", () => "⊞")
      .with("LeftCommand", "RightCommand", () => "⌘")
      .with("CapsLock", () => "⇪")
      .with("Grave", () => "`")
      .with("Slash", () => "/")
      .with("BackwardSlash", () => "\\")
      .with("SemiColon", () => ";")
      .with("Period", () => ".")
      .with("Comma", () => ",")
      .with("Apostrophe", () => "'")
      .with("LeftBrace", () => "[")
      .with("RightBrace", () => "]")
      // .with("Add", () => "+")
      // .with("Subtract", () => "-")
      // .with("Divide", () => "/")
      .with(P.string.startsWith("Number"), (s) => s.replace("Number", ""))
      .otherwise(() => name)
  );
}
