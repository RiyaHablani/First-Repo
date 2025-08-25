import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from '../services/task.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent implements OnInit {
  taskForm: FormGroup;
  isEditing = false;
  showDeleteModal = signal(false);

  task = signal<Task>({
    id: 0,
    title: '',
    description: '',
    status: '',
    priority: '',
    dueDate: '',
    createdAt: new Date(),
    lastUpdated: new Date()
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.minLength(5)]], // Removed required validator
      priority: ['', Validators.required],
      status: ['', Validators.required],
      dueDate: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Get the task ID from the route parameter
    this.route.params.subscribe(params => {
      const taskId = +params['id']; // Convert to number
      this.loadTask(taskId);
    });
  }

  // Load task based on ID
  loadTask(taskId: number) {
    const foundTask = this.taskService.getTaskById(taskId);
    
    if (foundTask) {
      this.task.set(foundTask);
      this.initializeForm();
    } else {
      // Task not found, redirect to dashboard
      console.warn(`Task with ID ${taskId} not found`);
      this.router.navigate(['/dashboard']);
    }
  }

  // Initialize form with current task data
  initializeForm() {
    const currentTask = this.task();
    if (currentTask && currentTask.id > 0) {
      this.taskForm.patchValue({
        title: currentTask.title || '',
        description: currentTask.description || '',
        priority: currentTask.priority || 'Medium Priority',
        status: currentTask.status || 'pending',
        dueDate: currentTask.dueDate || ''
      });
      
      // Mark form as pristine and untouched after setting values
      this.taskForm.markAsPristine();
      this.taskForm.markAsUntouched();
    }
  }

  // Toggle edit mode
  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      // Ensure form is properly initialized with current task values
      setTimeout(() => {
        this.initializeForm();
      }, 0);
    }
  }

  // Save changes
  saveChanges() {
    if (this.taskForm.valid) {
      const formValues = this.taskForm.value;
      
      // Set default description if not provided
      const description = formValues.description || 'No Description provided';
      
      const updatedTask = {
        ...this.task(),
        ...formValues,
        description: description
      };
      
      // Update the task in the service
      this.taskService.updateTask(updatedTask.id, updatedTask);
      
      // Get the updated task from service to ensure lastUpdated is properly set
      const refreshedTask = this.taskService.getTaskById(updatedTask.id);
      if (refreshedTask) {
        this.task.set(refreshedTask);
      } else {
        // Fallback: update local task signal with current date
        this.task.set({
          ...updatedTask,
          lastUpdated: new Date()
        });
      }
      
      this.isEditing = false;
    } else {
      this.markFormGroupTouched();
    }
  }

  // Cancel editing
  cancelEdit() {
    this.isEditing = false;
    this.initializeForm();
  }

  // Mark task as complete
  markComplete() {
    const updatedTask = {
      ...this.task(),
      status: 'completed'
    };
    
    // Update the task status in the service
    this.taskService.updateTaskStatus(updatedTask.id, 'completed');
    
    // Get the updated task from service to ensure lastUpdated is properly set
    const refreshedTask = this.taskService.getTaskById(updatedTask.id);
    if (refreshedTask) {
      this.task.set(refreshedTask);
    } else {
      // Fallback: update local task signal with current date
      this.task.set({
        ...updatedTask,
        lastUpdated: new Date()
      });
    }
    
    this.initializeForm();
  }

  // Show delete confirmation modal
  showDeleteConfirmation() {
    this.showDeleteModal.set(true);
  }

  // Hide delete confirmation modal
  hideDeleteConfirmation() {
    this.showDeleteModal.set(false);
  }

  // Delete task
  deleteTask() {
    // Delete the task from the service
    this.taskService.deleteTask(this.task().id);
    
    // Hide the modal
    this.hideDeleteConfirmation();
    
    // Navigate back to dashboard
    this.router.navigate(['/dashboard']);
  }

  // Mark all form controls as touched to trigger validation
  markFormGroupTouched() {
    Object.keys(this.taskForm.controls).forEach(key => {
      const control = this.taskForm.get(key);
      control?.markAsTouched();
    });
  }

  // Get form control for validation
  getFormControl(controlName: string) {
    return this.taskForm.get(controlName);
  }

  // Check if form control has error
  hasError(controlName: string, errorType: string): boolean {
    const control = this.getFormControl(controlName);
    return control ? control.hasError(errorType) && control.touched : false;
  }

  // Get priority color class
  getPriorityClass(priority: string): string {
    const priorityMap: { [key: string]: string } = {
      'Low Priority': 'priority-low',
      'Medium Priority': 'priority-medium',
      'High Priority': 'priority-high'
    };
    return priorityMap[priority] || 'priority-medium';
  }

  // Get status color class
  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  // Get status icon
  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending': return '⏳';
      case 'in-progress': return '🔄';
      case 'completed': return '✅';
      default: return '📋';
    }
  }

  // Format date for display
  formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
