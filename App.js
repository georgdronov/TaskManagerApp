import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import {
  Provider as PaperProvider,
  DefaultTheme,
  TextInput,
  Button,
  Card,
  IconButton,
  Dialog,
  Portal,
  Menu,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const enhancedTheme = {
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

export default function App() {
  return (
    <PaperProvider theme={enhancedTheme}>
      <TaskApp />
    </PaperProvider>
  );
}

function TaskApp() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: null,
    completionDate: null,
    location: "",
    status: "New",
  });
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(null);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showCompletionDatePicker, setShowCompletionDatePicker] =
    useState(false);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [filterType, setFilterType] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
    } catch {
      Alert.alert("Error", "Failed to save tasks!");
    }
  };

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) setTasks(JSON.parse(storedTasks));
    } catch {
      Alert.alert("Error", "Failed to load tasks!");
    }
  };

  const addTask = () => {
    if (newTask.title.trim() && newTask.description.trim()) {
      setTasks([{ ...newTask, id: Date.now().toString() }, ...tasks]);
      setNewTask({
        title: "",
        description: "",
        dueDate: null,
        completionDate: null,
        location: "",
        status: "New",
      });
      setIsDialogVisible(false);
    } else {
      Alert.alert("Validation Error", "Title and Description are required!");
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTaskStatus = (id, status) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, status } : task))
    );
    setMenuVisible(null);
  };

  const handleDueDateChange = (event, selectedDate) => {
    setShowDueDatePicker(false);
    if (selectedDate) {
      setNewTask({
        ...newTask,
        dueDate: selectedDate.toISOString().split("T")[0],
      });
    }
  };

  const handleCompletionDateChange = (event, selectedDate) => {
    setShowCompletionDatePicker(false);
    if (selectedDate) {
      const dueDate = new Date(newTask.dueDate);
      if (dueDate && selectedDate < dueDate) {
        Alert.alert("Validation Error", "Completion date cannot be earlier than due date!");
        return;
      }
      setNewTask({
        ...newTask,
        completionDate: selectedDate.toISOString().split("T")[0],
      });
    }
  };

  const filterTasks = (type) => {
    setFilterType(type);
    setFilterMenuVisible(false);
  };

  const filteredTasks = () => {
    if (filterType === "date") {
      return [...tasks].sort(
        (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
      );
    } else if (filterType === "status") {
      return [...tasks].sort((a, b) => a.status.localeCompare(b.status));
    }
    return tasks;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={filteredTasks()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.info}>
                Due Date: {item.dueDate || "Not Set"}
              </Text>
              <Text style={styles.info}>
                Completion Date: {item.completionDate || "Not Set"}
              </Text>
              <Text style={styles.info}>Location: {item.location}</Text>
              <Text style={styles.info}>Status: {item.status}</Text>
            </Card.Content>
            <Card.Actions>
              <Menu
                visible={menuVisible === item.id}
                onDismiss={() => setMenuVisible(null)}
                anchor={
                  <Button
                    onPress={() => setMenuVisible(item.id)}
                    style={styles.menuButton}
                    textColor="#ffffff"
                  >
                    Change Status
                  </Button>
                }
              >
                <Menu.Item
                  title="In Progress"
                  onPress={() => updateTaskStatus(item.id, "In Progress")}
                />
                <Menu.Item
                  title="Completed"
                  onPress={() => updateTaskStatus(item.id, "Completed")}
                />
                <Menu.Item
                  title="Cancelled"
                  onPress={() => updateTaskStatus(item.id, "Cancelled")}
                />
              </Menu>
              <IconButton
                icon="delete"
                color="red"
                size={20}
                onPress={() => deleteTask(item.id)}
              />
            </Card.Actions>
          </Card>
        )}
      />

      <View style={styles.filterContainer}>
        <Menu
          visible={filterMenuVisible}
          onDismiss={() => setFilterMenuVisible(false)}
          anchor={
            <Button
              onPress={() => setFilterMenuVisible(true)}
              style={styles.filterButton}
              textColor="#ffffff"
            >
              Filter
            </Button>
          }
        >
          <Menu.Item onPress={() => filterTasks("date")} title="Sort by Date" />
          <Menu.Item
            onPress={() => filterTasks("status")}
            title="Sort by Status"
          />
        </Menu>
      </View>

      <Portal>
        <Dialog
          visible={isDialogVisible}
          onDismiss={() => setIsDialogVisible(false)}
        >
          <Dialog.Title>Add New Task</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Title"
              value={newTask.title}
              onChangeText={(text) => setNewTask({ ...newTask, title: text })}
              style={styles.input}
            />
            <TextInput
              label="Description"
              value={newTask.description}
              onChangeText={(text) =>
                setNewTask({ ...newTask, description: text })
              }
              style={styles.input}
            />
            <TextInput
              label="Location"
              value={newTask.location}
              onChangeText={(text) =>
                setNewTask({ ...newTask, location: text })
              }
              style={styles.input}
            />
            <Button
              mode="outlined"
              onPress={() => setShowDueDatePicker(true)}
              style={[styles.dateButton, styles.greenButton]}
              textColor="#ffffff"
            >
              {newTask.dueDate || "Set Due Date"}
            </Button>
            {showDueDatePicker && (
              <DateTimePicker
                value={newTask.dueDate ? new Date(newTask.dueDate) : new Date()}
                mode="date"
                display="default"
                onChange={handleDueDateChange}
              />
            )}
            <Button
              mode="outlined"
              onPress={() => setShowCompletionDatePicker(true)}
              style={[styles.dateButton, styles.greenButton]}
              textColor="#ffffff"
            >
              {newTask.completionDate || "Set Completion Date"}
            </Button>
            {showCompletionDatePicker && (
              <DateTimePicker
                value={
                  newTask.completionDate
                    ? new Date(newTask.completionDate)
                    : new Date()
                }
                mode="date"
                display="default"
                onChange={handleCompletionDateChange}
              />
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setIsDialogVisible(false)}
              mode="contained"
              style={[styles.actionButton, styles.cancelButton]}
            >
              Cancel
            </Button>
            <Button
              onPress={addTask}
              mode="contained"
              style={[styles.actionButton, styles.addButton]}
            >
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Button
        mode="contained"
        onPress={() => setIsDialogVisible(true)}
        style={styles.addButton}
        textColor="#ffffff"
      >
        Add Tasks
      </Button>
    </KeyboardAvoidingView>
  );
}

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
  },
  menuButton: {
    backgroundColor: enhancedTheme.colors.primary,
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
  },
  greenButton: {
    backgroundColor: enhancedTheme.colors.primary,
    color: "#ffffff",
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
  },
});
