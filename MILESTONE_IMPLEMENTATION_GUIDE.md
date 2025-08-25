# Task Management Application - Milestone Implementation Guide

## 🎯 Overview
This document provides a detailed technical explanation of how each milestone was implemented in the Task Management Application. This guide is designed for viva preparation and demonstrates the complete development flow.

## 📋 Milestone 1: Base Page Setup

### **Objective:** Develop the main landing page with task creation and status display

### **Implementation Details:**

#### **1.1 Component Structure**
```typescript
// src/app/home/home.component.ts
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  // Component implementation
}
```

#### **1.2 Reactive Form Implementation**
```typescript
// Form creation with validation
taskForm = this.fb.group({
  title: ['', Validators.required],           // Required field validation
  description: [''],                          // Optional field
  dueDate: [''],                             // Auto-defaults to 7 days
  priority: ['Low Priority']                 // Default priority
});
```

#### **1.3 Task Creation Logic**
```typescript
createTask() {
  if (this.taskForm.valid) {
    const formValue = this.taskForm.value;
    
    // Auto-default logic
    const dueDate = formValue.dueDate || this.getDefaultDueDate();
    const description = formValue.description || 'No Description provided';
    
    // Create task object
    const newTask = {
      title: formValue.title!,
      description: description,
      dueDate: dueDate,
      priority: formValue.priority!
    };
    
    // Add to service (adds to beginning of array)
    this.taskService.addTask(newTask);
    
    // Reset form
    this.taskForm.reset({
      priority: 'Low Priority'
    });
  }
}
```

#### **1.4 Statistics Display**
```typescript
// Real-time statistics using computed properties
tasksToday = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return this.taskService.tasks().filter(task => 
    task.dueDate === today
  ).length;
});

inProgressTasks = computed(() => {
  return this.taskService.tasks().filter(task => 
    task.status === 'in-progress'
  ).length;
});

completedTasks = computed(() => {
  return this.taskService.tasks().filter(task => 
    task.status === 'completed'
  ).length;
});
```

#### **1.5 Validation Implementation**
```html
<!-- src/app/home/home.component.html -->
<div class="form-group">
  <label for="title">Task Title *</label>
  <input 
    type="text" 
    id="title" 
    formControlName="title"
    [class.error]="taskForm.get('title')?.invalid && taskForm.get('title')?.touched"
  >
  <div class="error-message" *ngIf="taskForm.get('title')?.invalid && taskForm.get('title')?.touched">
    <div class="error-icon">⚠</div>
    Please fill out this field
  </div>
</div>
```

#### **1.6 Custom Error Styling**
```scss
// src/app/home/home.component.scss
.error-message {
  display: flex;
  align-items: center;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  padding: 8px 12px;
  margin-top: 4px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 20px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid #ffeaa7;
  }
}
```

---

## 📊 Milestone 2: Dashboard Functionality

### **Objective:** Build comprehensive task management dashboard

### **Implementation Details:**

#### **2.1 Component Setup with Search & Filter**
```typescript
// src/app/dashboard/dashboard.component.ts
export class DashboardComponent implements OnInit {
  // Search and filter signals
  searchText = signal('');
  statusFilter = signal('All Status');
  priorityFilter = signal('All Priorities');
  
  // Computed filtered tasks
  filteredTasks = computed(() => {
    const tasks = this.taskService.tasks();
    const search = this.searchText().toLowerCase();
    const status = this.statusFilter();
    const priority = this.priorityFilter();
    
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(search) ||
                           task.description.toLowerCase().includes(search);
      const matchesStatus = status === 'All Status' || task.status === status;
      const matchesPriority = priority === 'All Priorities' || task.priority === priority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  });
}
```

#### **2.2 Search & Filter Template**
```html
<!-- src/app/dashboard/dashboard.component.html -->
<div class="search-filter-section">
  <div class="search-box">
    <input 
      type="text" 
      placeholder="🔍 Search tasks..." 
      [(ngModel)]="searchText"
      (ngModelChange)="searchText.set($event)"
    >
  </div>
  
  <div class="filter-controls">
    <select [(ngModel)]="statusFilter" (ngModelChange)="statusFilter.set($event)">
      <option value="All Status">All Status</option>
      <option value="pending">Pending</option>
      <option value="in-progress">In Progress</option>
      <option value="completed">Completed</option>
    </select>
    
    <select [(ngModel)]="priorityFilter" (ngModelChange)="priorityFilter.set($event)">
      <option value="All Priorities">All Priorities</option>
      <option value="Low Priority">Low Priority</option>
      <option value="Medium Priority">Medium Priority</option>
      <option value="High Priority">High Priority</option>
    </select>
  </div>
</div>
```

#### **2.3 Task List with Clickable Rows**
```html
<div class="task-list">
  <div 
    class="task-item" 
    *ngFor="let task of filteredTasks()"
    (click)="navigateToTaskDetail(task.id)"
  >
    <div class="task-info">
      <h3>{{ task.title }}</h3>
      <p>{{ task.description }}</p>
      <div class="task-meta">
        <span class="due-date">Due: {{ formatDate(task.dueDate) }}</span>
        <span class="priority" [class]="getPriorityClass(task.priority)">
          {{ task.priority }}
        </span>
      </div>
    </div>
    
    <div class="task-controls" (click)="$event.stopPropagation()">
      <select 
        [value]="task.status"
        (change)="onStatusChange($event, task.id)"
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      
      <button 
        class="delete-btn" 
        (click)="deleteTask(task.id)"
      >
        🗑️
      </button>
    </div>
  </div>
</div>
```

#### **2.4 Status Update Handler**
```typescript
onStatusChange(event: Event, taskId: number) {
  const selectElement = event.target as HTMLSelectElement;
  const newStatus = selectElement.value;
  
  // Update task status via service
  this.taskService.updateTaskStatus(taskId, newStatus);
}
```

#### **2.5 Navigation Implementation**
```typescript
navigateToTaskDetail(taskId: number) {
  this.router.navigate(['/task', taskId]);
}
```

---

## 🔍 Milestone 3: Task Detail Page

### **Objective:** Create detailed task view with edit and delete functionality

### **Implementation Details:**

#### **3.1 Route Parameter Handling**
```typescript
// src/app/task-detail/task-detail.component.ts
export class TaskDetailComponent implements OnInit {
  task = signal<Task>({
    id: 0,
    title: '',
    description: '',
    status: 'pending',
    priority: 'Low Priority',
    dueDate: '',
    createdAt: new Date(),
    lastUpdated: new Date()
  });
  
  ngOnInit() {
    // Subscribe to route parameters
    this.route.params.subscribe(params => {
      const taskId = +params['id'];
      this.loadTask(taskId);
    });
  }
  
  loadTask(taskId: number) {
    const foundTask = this.taskService.getTaskById(taskId);
    if (foundTask) {
      this.task.set(foundTask);
    }
  }
}
```

#### **3.2 Edit Mode Toggle**
```typescript
isEditMode = signal(false);

toggleEdit() {
  this.isEditMode.update(mode => !mode);
  
  if (this.isEditMode()) {
    // Initialize form with current task data
    setTimeout(() => {
      this.initializeForm();
    });
  }
}

initializeForm() {
  const currentTask = this.task();
  this.taskForm.patchValue({
    title: currentTask.title,
    description: currentTask.description,
    dueDate: currentTask.dueDate,
    priority: currentTask.priority
  });
  
  // Reset form state
  this.taskForm.markAsPristine();
  this.taskForm.markAsUntouched();
}
```

#### **3.3 Form Validation**
```typescript
taskForm = this.fb.group({
  title: ['', Validators.required],
  description: ['', Validators.minLength(5)],  // Minimum 5 characters
  dueDate: ['', Validators.required],
  priority: ['', Validators.required]
});
```

#### **3.4 Save Changes Logic**
```typescript
saveChanges() {
  if (this.taskForm.valid) {
    const formValue = this.taskForm.value;
    const currentTask = this.task();
    
    // Handle empty description
    const description = formValue.description || 'No Description provided';
    
    const updatedTask: Task = {
      ...currentTask,
      title: formValue.title!,
      description: description,
      dueDate: formValue.dueDate!,
      priority: formValue.priority!
    };
    
    // Update via service
    this.taskService.updateTask(updatedTask.id, updatedTask);
    
    // Refresh task data to get updated lastUpdated
    const refreshedTask = this.taskService.getTaskById(updatedTask.id);
    if (refreshedTask) {
      this.task.set(refreshedTask);
    }
    
    // Exit edit mode
    this.isEditMode.set(false);
  }
}
```

#### **3.5 Custom Delete Confirmation Modal**
```typescript
showDeleteModal = signal(false);

showDeleteConfirmation() {
  this.showDeleteModal.set(true);
}

hideDeleteConfirmation() {
  this.showDeleteModal.set(false);
}

deleteTask() {
  this.taskService.deleteTask(this.task().id);
  this.hideDeleteConfirmation();
  this.router.navigate(['/dashboard']);
}
```

#### **3.6 Inline Modal Template**
```html
<div class="danger-zone">
  <h3>Danger Zone</h3>
  <button class="delete-btn" (click)="showDeleteConfirmation()">
    Delete Task
  </button>
  
  <!-- Inline confirmation modal -->
  <div class="delete-confirmation" *ngIf="showDeleteModal()">
    <p>Are you sure you want to delete this task? This action cannot be undone.</p>
    <div class="confirmation-buttons">
      <button class="confirm-delete" (click)="deleteTask()">
        Yes, Delete Task
      </button>
      <button class="cancel-delete" (click)="hideDeleteConfirmation()">
        Cancel
      </button>
    </div>
  </div>
</div>
```

---

## 🚀 Milestone 4: Routing Implementation

### **Objective:** Implement seamless navigation between pages

### **Implementation Details:**

#### **4.1 Route Configuration**
```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TasksComponent } from './tasks/tasks.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },                    // Home page
  { path: 'dashboard', component: DashboardComponent },     // Dashboard
  { path: 'tasks', component: TasksComponent },             // Tasks list
  { path: 'task/:id', component: TaskDetailComponent }      // Task detail with ID parameter
];
```

#### **4.2 App Configuration**
```typescript
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)  // Enable routing
  ]
};
```

#### **4.3 Main App Template**
```html
<!-- src/app/app.html -->
<header>
  <h1>Task Manager</h1>
</header>
<main>
  <router-outlet></router-outlet>  <!-- Dynamic component loading -->
</main>
```

#### **4.4 Navigation Links**
```html
<!-- Home to Dashboard -->
<button routerLink="/dashboard">View Dashboard</button>

<!-- Dashboard to Home -->
<button routerLink="/">Back to Home</button>

<!-- Dashboard to Task Detail -->
<div class="task-item" (click)="navigateToTaskDetail(task.id)">
  <!-- Task content -->
</div>
```

#### **4.5 Programmatic Navigation**
```typescript
// In components
constructor(private router: Router) {}

navigateToTaskDetail(taskId: number) {
  this.router.navigate(['/task', taskId]);
}

// After task deletion
deleteTask() {
  this.taskService.deleteTask(taskId);
  this.router.navigate(['/dashboard']);  // Return to dashboard
}
```

---

## 🏗️ Milestone 5: Code Base Structure & Best Practices

### **Objective:** Establish maintainable and scalable code architecture

### **Implementation Details:**

#### **5.1 Folder Structure Organization**
```
src/app/
├── services/           # Business logic layer
│   └── task.service.ts
├── home/              # Feature components
│   ├── home.component.ts
│   ├── home.component.html
│   └── home.component.scss
├── dashboard/
│   ├── dashboard.component.ts
│   ├── dashboard.component.html
│   └── dashboard.component.scss
├── task-detail/
│   ├── task-detail.component.ts
│   ├── task-detail.component.html
│   └── task-detail.component.scss
├── tasks/
│   ├── tasks.component.ts
│   ├── tasks.component.html
│   └── tasks.component.scss
├── app.ts             # Root component
├── app.html           # Root template
├── app.scss           # Global styles
├── app.config.ts      # App configuration
└── app.routes.ts      # Routing configuration
```

#### **5.2 Service Layer Implementation**
```typescript
// src/app/services/task.service.ts
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Private signal for internal state
  private readonly _tasks = signal<Task[]>([]);
  
  // Public readonly signal for external access
  readonly tasks = this._tasks.asReadonly();
  
  // Storage key for persistence
  private readonly STORAGE_KEY = 'task-manager-tasks';
  
  constructor() {
    // Initialize with data from localStorage or defaults
    this._tasks.set(this.loadTasksFromStorage());
  }
  
  // CRUD Operations
  addTask(task: Omit<Task, 'id' | 'createdAt' | 'lastUpdated'>) {
    const newTask: Task = {
      ...task,
      id: this.generateId(),
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    
    // Add to beginning of array
    this._tasks.update(tasks => [newTask, ...tasks]);
    this.saveTasksToStorage(this._tasks());
  }
  
  updateTask(id: number, updatedTask: Task) {
    this._tasks.update(tasks => 
      tasks.map(task => 
        task.id === id 
          ? { ...updatedTask, lastUpdated: new Date() }
          : task
      )
    );
    this.saveTasksToStorage(this._tasks());
  }
  
  deleteTask(id: number) {
    this._tasks.update(tasks => 
      tasks.filter(task => task.id !== id)
    );
    this.saveTasksToStorage(this._tasks());
  }
}
```

#### **5.3 Data Persistence Implementation**
```typescript
// LocalStorage integration
private loadTasksFromStorage(): Task[] {
  try {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((task: any) => ({
        ...task,
        createdAt: this.parseDateFromStorage(task.createdAt),
        lastUpdated: this.parseDateFromStorage(task.lastUpdated)
      }));
    }
  } catch (error) {
    console.error('Error loading tasks from storage:', error);
  }
  return this.getDefaultTasks();
}

private saveTasksToStorage(tasks: Task[]) {
  try {
    const serialized = tasks.map(task => ({
      ...task,
      createdAt: this.formatDateForStorage(task.createdAt),
      lastUpdated: this.formatDateForStorage(task.lastUpdated)
    }));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serialized));
  } catch (error) {
    console.error('Error saving tasks to storage:', error);
  }
}
```

#### **5.4 Date Formatting Utilities**
```typescript
private formatDateForStorage(date: Date): string {
  return date.toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

private parseDateFromStorage(dateString: string): Date {
  try {
    return new Date(dateString);
  } catch {
    return new Date();  // Fallback to current date
  }
}
```

#### **5.5 Component Communication Pattern**
```typescript
// Dependency Injection Pattern
export class HomeComponent {
  constructor(
    private fb: FormBuilder,
    private taskService: TaskService  // Service injection
  ) {}
}

export class DashboardComponent {
  constructor(
    private taskService: TaskService,
    private router: Router  // Router injection
  ) {}
}
```

#### **5.6 Reactive State Management**
```typescript
// Using Angular Signals for reactive updates
export class DashboardComponent {
  // Local state
  searchText = signal('');
  statusFilter = signal('All Status');
  
  // Computed state (automatically updates when dependencies change)
  filteredTasks = computed(() => {
    const tasks = this.taskService.tasks();
    const search = this.searchText();
    const status = this.statusFilter();
    
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === 'All Status' || task.status === status;
      return matchesSearch && matchesStatus;
    });
  });
}
```

#### **5.7 Error Handling & Validation**
```typescript
// Comprehensive error handling
createTask() {
  if (this.taskForm.valid) {
    try {
      const newTask = this.buildTaskFromForm();
      this.taskService.addTask(newTask);
      this.taskForm.reset();
      this.showSuccessMessage('Task created successfully!');
    } catch (error) {
      this.showErrorMessage('Failed to create task. Please try again.');
      console.error('Task creation error:', error);
    }
  } else {
    this.markFormAsTouched();
  }
}

private markFormAsTouched() {
  Object.keys(this.taskForm.controls).forEach(key => {
    const control = this.taskForm.get(key);
    control?.markAsTouched();
  });
}
```

#### **5.8 Responsive Design Implementation**
```scss
// Global responsive utilities
@mixin mobile {
  @media (max-width: 768px) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: 769px) and (max-width: 1024px) {
    @content;
  }
}

// Component-specific responsive design
.task-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  
  @include mobile {
    grid-template-columns: 1fr;
  }
}
```

---

## 🔧 Technical Architecture Summary

### **Key Design Patterns Used:**

1. **Service Layer Pattern:** Centralized data management
2. **Dependency Injection:** Loose coupling between components
3. **Reactive Programming:** Angular Signals for state management
4. **Component Communication:** Service-based communication
5. **Form Validation:** Reactive forms with custom validation
6. **Error Handling:** Comprehensive error recovery
7. **Data Persistence:** LocalStorage with JSON serialization

### **Angular Features Leveraged:**

- **Standalone Components:** Modern Angular architecture
- **Angular Signals:** Reactive state management
- **Reactive Forms:** Form handling and validation
- **Router Module:** Navigation and routing
- **Dependency Injection:** Service management
- **Lifecycle Hooks:** Component initialization
- **Computed Properties:** Derived state calculations

### **Best Practices Implemented:**

- **Separation of Concerns:** Clear component responsibilities
- **Single Responsibility:** Each component has one purpose
- **DRY Principle:** Reusable utilities and services
- **Type Safety:** Full TypeScript implementation
- **Error Boundaries:** Graceful error handling
- **Performance Optimization:** Efficient change detection
- **Accessibility:** ARIA labels and keyboard navigation

This implementation demonstrates a complete, production-ready Angular application with modern best practices, comprehensive error handling, and scalable architecture.
