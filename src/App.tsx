import { createSignal, onMount, onCleanup, For } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { listen, UnlistenFn } from "@tauri-apps/api/event";

import Key from "./components/Key";

type Payload = {
  key: string;
};

type KeyItem = {
  id: number;
  name: string;
  timeout: number;
};

function App() {
  const [unlisten, setUnlisten] = createSignal<UnlistenFn>();
  const [keys, setKeys] = createSignal<KeyItem[]>([]);
  const [countdown, setCountdown] = createSignal<number>();

  function createKey(id: number, name: string) {
    setCountdown((cd) => {
      if (cd) {
        clearTimeout(cd);
      }

      const timeout = setTimeout(() => setKeys([]), 5000);
      setKeys((keys) => {
        while (keys.length > 10) {
          keys.shift();
        }
        return [...keys, { id, name, timeout }];
      });
      return timeout;
    });
  }

  onMount(async () => {
    const m = /([A-z,0-9]+)\(([0-9]+)\)/;
    const unlisten = await listen<Payload>("kbi", (event) => {
      const {
        id,
        payload: { key },
      } = event;

      const res = key.match(m);
      if (res) {
        const [_, keyName, keyCode] = [...res];
        createKey(id, keyName);
      }
    });

    setUnlisten(() => unlisten);
  });

  onCleanup(() => {
    unlisten?.();
    for (const { timeout } of keys()) {
      clearTimeout(timeout);
    }
  });

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    // setGreetMsg(await invoke("greet", { name: name() }));
  }

  return (
    <main class="container">
      <For each={keys()}>{(ki) => <Key value={ki.name} />}</For>
    </main>
  );
}

export default App;
