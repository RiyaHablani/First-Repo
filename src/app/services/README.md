# Services Folder

This folder contains the business logic and data management services for the Task Management Application.

## 📁 Files

### `task.service.ts`
The core service that manages all task-related operations and data persistence.

## 🔧 TaskService Overview

### **Purpose**
- Centralized data management for all tasks
- LocalStorage persistence
- JSON data handling
- CRUD operations (Create, Read, Update, Delete)

### **Key Features**

#### **State Management**
- Uses Angular Signals for reactive state management
- `_tasks` signal holds the current task array
- `tasks` readonly signal for external access

#### **Data Persistence**
- **Storage:** Browser LocalStorage
- **Key:** `task-manager-tasks`
- **Format:** JSON string with formatted dates

#### **Date Handling**
- **Storage Format:** `MM/DD/YYYY, HH:MM:SS AM/PM`
- **Parsing:** Converts string dates back to Date objects
- **Auto-update:** `lastUpdated` field updates on every modification

### **Core Methods**

#### **Data Loading & Saving**
- `loadTasksFromStorage()`: Loads tasks from localStorage
- `saveTasksToStorage(tasks)`: Saves tasks to localStorage
- `formatDateForStorage(date)`: Formats Date to string
- `parseDateFromStorage(dateString)`: Parses string to Date

#### **CRUD Operations**
- `addTask(task)`: Creates new task (adds to beginning of array)
- `updateTask(id, updatedTask)`: Updates existing task
- `updateTaskStatus(id, status)`: Updates task status
- `deleteTask(id)`: Removes task from array
- `getTaskById(id)`: Retrieves specific task

#### **Data Export/Import**
- `exportTasksAsJSON()`: Returns tasks as formatted JSON string
- `importTasksFromJSON(jsonString)`: Imports tasks from JSON

### **Default Data**
- Contains 4 sample tasks in JSON format
- Tasks have different statuses, priorities, and dates
- Used when no data exists in localStorage

### **Error Handling**
- Graceful fallback to default tasks if localStorage fails
- Date parsing with fallback to current date
- JSON parsing with error recovery

## 🔄 Data Flow

1. **Initialization:** Service loads data from localStorage or uses defaults
2. **Operations:** Components call service methods for CRUD operations
3. **Persistence:** All changes are automatically saved to localStorage
4. **Reactivity:** Components automatically update when data changes

## 📊 Data Structure

```typescript
interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'Low Priority' | 'Medium Priority' | 'High Priority';
  dueDate: string;
  createdAt: Date;
  lastUpdated: Date;
}
```

## 🎯 Usage in Components

- **HomeComponent:** Uses for task creation and statistics
- **DashboardComponent:** Uses for task listing and management
- **TaskDetailComponent:** Uses for individual task operations

## 🔧 Technical Implementation

- **Angular Signals:** For reactive state management
- **LocalStorage API:** For data persistence
- **JSON.stringify/parse:** For data serialization
- **Date formatting:** Custom date formatting for readability
- **Error handling:** Robust error recovery mechanisms

This service is the backbone of the application, providing a single source of truth for all task data and ensuring data consistency across all components.
