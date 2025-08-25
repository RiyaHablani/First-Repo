# Home Component

The main landing page component that provides task creation functionality and dashboard statistics.

## 📁 Files

### `home.component.ts`
TypeScript logic for the home component.

### `home.component.html`
HTML template for the home page UI.

### `home.component.scss`
SCSS styles specific to the home component.

## 🎯 HomeComponent Overview

### **Purpose**
- Main landing page of the application
- Task creation form with validation
- Dashboard statistics display
- Navigation to dashboard

### **Key Features**

#### **Task Creation Form**
- **Reactive Form:** Uses Angular Reactive Forms
- **Validation:** Real-time form validation
- **Default Values:** Auto-fills due date (7 days) and description
- **Error Handling:** Custom error message styling

#### **Dashboard Statistics**
- **Real-time Counts:** Tasks Today, In Progress, Completed
- **Dynamic Updates:** Updates automatically when tasks change
- **Visual Design:** Matches provided design specifications

#### **Navigation**
- **View Dashboard Button:** Navigates to dashboard page
- **View All Tasks Link:** Alternative navigation to dashboard

### **Core Methods**

#### **Form Management**
- `createTask()`: Handles form submission and task creation
- `updateTaskCounts()`: Updates dashboard statistics
- `ngOnInit()`: Initializes component and loads data

#### **Data Integration**
- **TaskService Injection:** Uses shared service for data management
- **Signal Subscription:** Reactively updates when data changes
- **Form Reset:** Clears form after successful task creation

### **Form Validation**

#### **Required Fields**
- **Task Title:** Required field with custom error message
- **Due Date:** Auto-defaults to 7 days from current date
- **Description:** Auto-defaults to "No Description provided"

#### **Error Messages**
- **Custom Styling:** Orange background with icon
- **Real-time Display:** Shows immediately on validation failure
- **User-friendly:** Clear and descriptive error messages

## 🎨 UI Components

### **Header Section**
- **Title:** "Task Manager"
- **Subtitle:** "Create and organize your tasks efficiently."
- **Navigation:** "View Dashboard" button

### **Statistics Cards**
- **Tasks Today:** Count of tasks due today
- **In Progress:** Count of tasks in progress
- **Completed:** Count of completed tasks
- **Responsive Design:** Cards adjust to form width

### **Task Creation Form**
- **Task Title:** Text input with validation
- **Description:** Textarea with auto-default
- **Due Date:** Date picker with auto-default
- **Priority:** Dropdown with Low/Medium/High options
- **Submit Button:** Creates new task

## 🔧 Technical Implementation

### **Angular Features Used**
- **Reactive Forms:** FormBuilder, FormGroup, Validators
- **Angular Signals:** For reactive data updates
- **Dependency Injection:** TaskService injection
- **Lifecycle Hooks:** ngOnInit for initialization

### **Form Structure**
```typescript
taskForm = this.fb.group({
  title: ['', Validators.required],
  description: [''],
  dueDate: [''],
  priority: ['Low Priority']
});
```

### **Validation Logic**
- **Title Required:** Shows error if empty
- **Auto-defaults:** Due date and description have fallback values
- **Form Reset:** Clears form after submission

## 📊 Data Flow

1. **Component Initialization:** Loads task data and statistics
2. **Form Submission:** Creates new task via TaskService
3. **Statistics Update:** Automatically updates dashboard counts
4. **Form Reset:** Clears form for next task creation

## 🎨 Styling Features

### **Responsive Design**
- **Flexbox Layout:** Flexible card and form arrangement
- **Mobile Friendly:** Adapts to different screen sizes
- **Consistent Spacing:** Proper padding and margins

### **Visual Elements**
- **Error Messages:** Custom styled validation errors
- **Status Cards:** Visual representation of task counts
- **Form Styling:** Clean and modern input styling

## 🔄 Integration Points

### **TaskService Integration**
- **Data Access:** Reads task data for statistics
- **Task Creation:** Adds new tasks to the system
- **Reactive Updates:** Automatically reflects data changes

### **Routing Integration**
- **Navigation:** Routes to dashboard page
- **Button Links:** Uses routerLink for navigation

## 📝 Development Notes

- **Form Validation:** Comprehensive validation with custom styling
- **Default Values:** Smart defaults for better user experience
- **Error Handling:** Graceful error handling and user feedback
- **Performance:** Efficient data loading and updates
- **Accessibility:** Proper form labels and error messages

This component serves as the entry point of the application, providing an intuitive interface for task creation while displaying key statistics about the current task state.
