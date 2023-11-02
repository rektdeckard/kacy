import { getKeyRepresentation } from "../utils";
import "./key.css";

type KeyProps = { value: string };

function Key({ value }: KeyProps) {
  return <kbd class="key">{getKeyRepresentation(value)}</kbd>;
}

export default Key;
