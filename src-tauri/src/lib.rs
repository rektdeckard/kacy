use mki::Keyboard;

#[derive(Clone, serde::Serialize)]
pub struct KeyEventPayload {
    original: Keyboard,
    label: String,
    code: i32,
}

pub fn extract_key_payload(kbd: Keyboard) -> KeyEventPayload {
    let label = format!("{:?}", kbd);
    let code: i32 = kbd.into();

    KeyEventPayload {
        original: kbd,
        label,
        code,
    }
}
