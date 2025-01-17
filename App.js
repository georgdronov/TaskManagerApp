import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
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
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const enhancedTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#004d40',
    accent: '#00bfa5',
    background: '#eceff1',
    surface: '#ffffff',
    text: '#263238',
    placeholder: '#78909c',
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
    title: '',
    description: '',
    dateTime: '',
    location: '',
    status: 'New',
  });
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      Alert.alert('Error', 'Failed to save tasks!');
    }
  };

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load tasks!');
    }
  };

  const addTask = () => {
    if (newTask.title.trim() && newTask.description.trim()) {
      setTasks([{ ...newTask, id: Date.now().toString() }, ...tasks]);
      setNewTask({ title: '', description: '', dateTime: '', location: '', status: 'New' });
      setIsDialogVisible(false);
    } else {
      Alert.alert('Validation Error', 'Title and Description are required!');
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTaskStatus = (id, status) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, status } : task)));
    setMenuVisible(null); 
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.info}>Date & Time: {item.dateTime}</Text>
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
                  >
                    Change Status
                  </Button>
                }
              >
                <Menu.Item
                  title="In Progress"
                  onPress={() => updateTaskStatus(item.id, 'In Progress')}
                />
                <Menu.Item
                  title="Completed"
                  onPress={() => updateTaskStatus(item.id, 'Completed')}
                />
                <Menu.Item
                  title="Cancelled"
                  onPress={() => updateTaskStatus(item.id, 'Cancelled')}
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

      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)}>
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
              onChangeText={(text) => setNewTask({ ...newTask, description: text })}
              style={styles.input}
            />
            <TextInput
              label="Date and Time"
              value={newTask.dateTime}
              onChangeText={(text) => setNewTask({ ...newTask, dateTime: text })}
              style={styles.input}
            />
            <TextInput
              label="Location"
              value={newTask.location}
              onChangeText={(text) => setNewTask({ ...newTask, location: text })}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDialogVisible(false)}>Cancel</Button>
            <Button onPress={addTask}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Button
        mode="contained"
        onPress={() => setIsDialogVisible(true)}
        style={styles.addButton}
      >
        Add Task
      </Button>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: enhancedTheme.colors.background,
    padding: 10,
  },
  card: {
    marginBottom: 10,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    marginTop: 5,
  },
  info: {
    fontSize: 12,
    color: '#78909c',
    marginTop: 3,
  },
  addButton: {
    margin: 10,
  },
  input: {
    marginBottom: 10,
  },
});

