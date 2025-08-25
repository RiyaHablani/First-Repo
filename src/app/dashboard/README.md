# Dashboard Component

The main dashboard component that displays all tasks with search, filter, and management capabilities.

## 📁 Files

### `dashboard.component.ts`
TypeScript logic for the dashboard component.

### `dashboard.component.html`
HTML template for the dashboard UI.

### `dashboard.component.scss`
SCSS styles specific to the dashboard component.

## 🎯 DashboardComponent Overview

### **Purpose**
- Display all tasks in a comprehensive list
- Provide search and filter functionality
- Enable task status updates and deletion
- Navigate to task details

### **Key Features**

#### **Task Management**
- **Complete Task List:** Displays all tasks with full details
- **Status Updates:** Dropdown to change task status
- **Task Deletion:** Delete button for each task
- **Clickable Rows:** Entire task row navigates to details

#### **Search & Filter**
- **Text Search:** Search by task title and description
- **Status Filter:** Filter by task status (All, Pending, In Progress, Completed)
- **Priority Filter:** Filter by priority level
- **Real-time Filtering:** Updates results as you type

#### **Navigation**
- **Back to Home:** Returns to home page
- **Task Details:** Click any task row to view details
- **Router Integration:** Uses Angular Router for navigation

### **Core Methods**

#### **Data Management**
- `ngOnInit()`: Initializes component and loads task data
- `updateTaskCounts()`: Updates dashboard statistics
- `navigateToTaskDetail(taskId)`: Navigates to task detail page

#### **Search & Filter**
- `filterTasks()`: Filters tasks based on search text and filters
- `onStatusChange(event, taskId)`: Handles status dropdown changes
- `onPriorityChange(event)`: Handles priority filter changes

#### **Task Operations**
- `updateTaskStatus(taskId, status)`: Updates task status via service
- `deleteTask(taskId)`: Deletes task via service

### **Computed Properties**

#### **Filtered Tasks**
- **Reactive Filtering:** Automatically updates when search/filters change
- **Performance Optimized:** Efficient filtering algorithm
- **Case Insensitive:** Search works regardless of case

#### **Statistics**
- **Real-time Counts:** Updates automatically when tasks change
- **Filtered Statistics:** Shows counts for current filter view

## 🎨 UI Components

### **Header Section**
- **Title:** "Task Dashboard"
- **Navigation:** "Back to Home" button
- **Statistics:** Task counts display

### **Search & Filter Section**
- **Search Input:** Text search with placeholder
- **Status Filter:** Dropdown for status filtering
- **Priority Filter:** Dropdown for priority filtering
- **Clean Design:** Organized in a search box layout

### **Task List**
- **Task Cards:** Individual task display cards
- **Status Indicators:** Visual status representation
- **Priority Badges:** Color-coded priority indicators
- **Action Buttons:** Status dropdown and delete button
- **Clickable Areas:** Entire row navigates to details

### **Task Information Display**
- **Task Title:** Prominent display
- **Description:** Truncated for space efficiency
- **Due Date:** Formatted date display
- **Priority:** Visual priority indicator
- **Status:** Current status with icon

## 🔧 Technical Implementation

### **Angular Features Used**
- **Angular Signals:** For reactive data management
- **Computed Properties:** For filtered task lists
- **Router Integration:** For navigation
- **Event Handling:** For user interactions
- **FormsModule:** For search and filter inputs

### **Data Flow**
```typescript
// Reactive data flow
tasks = this.taskService.tasks;
filteredTasks = computed(() => {
  // Filter logic based on search and filters
});
```

### **Search & Filter Logic**
- **Text Search:** Searches title and description
- **Status Filter:** Filters by exact status match
- **Priority Filter:** Filters by exact priority match
- **Combined Filtering:** All filters work together

## 📊 Data Integration

### **TaskService Integration**
- **Data Source:** Uses TaskService for all task data
- **CRUD Operations:** All task modifications go through service
- **Reactive Updates:** Automatically reflects service changes

### **State Management**
- **Local State:** Search text and filter values
- **Computed State:** Filtered task list
- **Service State:** Task data from TaskService

## 🎨 Styling Features

### **Responsive Design**
- **Flexbox Layout:** Flexible task card arrangement
- **Grid System:** Responsive grid for different screen sizes
- **Mobile Optimization:** Touch-friendly interface

### **Visual Elements**
- **Status Icons:** Visual status indicators (⏳, 🔄, ✅)
- **Priority Colors:** Color-coded priority badges
- **Hover Effects:** Interactive hover states
- **Clean Typography:** Readable text hierarchy

### **Interactive Elements**
- **Clickable Rows:** Entire task row is clickable
- **Button States:** Clear button hover and active states
- **Form Controls:** Styled dropdowns and inputs

## 🔄 User Interactions

### **Task Navigation**
- **Row Click:** Navigates to task detail page
- **Event Propagation:** Prevents navigation on control clicks
- **Router Integration:** Uses Angular Router for navigation

### **Task Management**
- **Status Updates:** Dropdown changes task status
- **Task Deletion:** Delete button removes task
- **Real-time Updates:** Changes reflect immediately

### **Search & Filter**
- **Instant Search:** Results update as you type
- **Filter Combinations:** Multiple filters work together
- **Clear Filters:** Easy to reset search and filters

## 📝 Development Notes

### **Performance Optimizations**
- **Computed Properties:** Efficient filtering without unnecessary recalculations
- **Event Handling:** Proper event propagation management
- **Memory Management:** Clean component lifecycle

### **User Experience**
- **Intuitive Navigation:** Clear navigation patterns
- **Visual Feedback:** Immediate response to user actions
- **Accessibility:** Proper ARIA labels and keyboard navigation

### **Code Quality**
- **Type Safety:** Full TypeScript implementation
- **Error Handling:** Graceful error handling
- **Maintainability:** Clean, well-structured code

This component provides a comprehensive task management interface, allowing users to efficiently view, search, filter, and manage all their tasks in one centralized location.
