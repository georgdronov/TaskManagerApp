import { StyleSheet } from "react-native";
import { DefaultTheme } from "react-native-paper";

// Расширенная тема
export const enhancedTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#004d40",
    accent: "#00bfa5",
    background: "#eceff1",
    surface: "#ffffff",
    text: "#263238",
    placeholder: "#78909c",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: enhancedTheme.colors.background,
    padding: 10,
    paddingTop: "15%",
  },
  filterContainer: {
    marginBottom: 10,
  },
  filterButton: {
    width: "100%",
    backgroundColor: enhancedTheme.colors.primary,
    borderRadius: 5,
  },
  menuButton: {
    backgroundColor: enhancedTheme.colors.primary,
    borderRadius: 5,
  },
  listContainer: {
    paddingTop: "5%",
  },
  card: {
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    marginTop: 5,
  },
  info: {
    fontSize: 12,
  },
  input: {
    marginBottom: 10,
  },
  dateButton: {
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: enhancedTheme.colors.primary,
    color: "#ffffff",
    borderRadius: 5,
  },
  actionButton: {
    flex: 1,
    margin: 5,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: "#d32f2f",
  },
  addButton: {
    backgroundColor: enhancedTheme.colors.primary,
    borderRadius: 5,
  },
  taskDetailDialog: {
    maxHeight: "80%",
  },
  taskDetailDescription: {
    marginBottom: 10,
  },
  closeIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  dialogTitle: {
    position: "relative",
  },
  closeIconTopRight: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeButton: {
    marginTop: 16,
    maxWidth: "30%",
  },
});

export default styles;
