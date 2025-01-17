# Task Manager App

Task management application built with **React Native**.

## Features

- **Add Tasks**: Create tasks with the following fields:
  - Task Title
  - Task Description
  - Date and Time of Execution
  - Location (manual address input)
  
- **Task List**:
  - View all tasks with key information (title, date/time, status).
  - Sort tasks by date added or status.

- **Manage Tasks**:
  - Mark tasks as "In Progress", "Completed", or "Cancelled".
  - Edit task details.
  - Delete tasks.

- **Local Storage**:
  - Task data is saved locally using `@react-native-async-storage/async-storage`.

- **Validation**:
  - Input validation with error feedback for users.

## Tech Stack

### Core Framework:
- **React Native**: Cross-platform mobile app development framework.

### UI and Styling:
- **React Native Paper**: For modern UI components and theming.
- **React Native Gesture Handler**: For better gesture control in the app.
- **React Native Safe Area Context**: Ensures content is rendered within safe areas on devices.

### State Management:
- **useState**: Built-in React hook for managing local component states.

### Local Storage:
- **@react-native-async-storage/async-storage**: For persisting task data locally.

### Additional Libraries:
- **React Native DateTimePicker**: For picking dates and times.
- **React Native Modal**: To implement pop-ups for task creation and editing.