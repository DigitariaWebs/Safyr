import { Text, TextInput } from "react-native";

/**
 * Apply Montserrat font as default to all Text and TextInput components
 * This should be called once at app startup
 */
export function applyMontserratGlobally() {
  // Set default font for Text components
  // @ts-ignore - defaultProps is deprecated but still works for setting defaults
  if (Text.defaultProps === undefined) {
    Text.defaultProps = {};
  }
  // @ts-ignore
  if (Text.defaultProps.style === undefined) {
    // @ts-ignore
    Text.defaultProps.style = {};
  }
  // @ts-ignore
  Text.defaultProps.style.fontFamily = "Montserrat-Regular";

  // Set default font for TextInput components
  // @ts-ignore
  if (TextInput.defaultProps === undefined) {
    TextInput.defaultProps = {};
  }
  // @ts-ignore
  if (TextInput.defaultProps.style === undefined) {
    // @ts-ignore
    TextInput.defaultProps.style = {};
  }
  // @ts-ignore
  TextInput.defaultProps.style.fontFamily = "Montserrat-Regular";
}
