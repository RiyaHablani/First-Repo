import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  // Task statistics
  tasksToday = signal(0);
  inProgress = signal(0);
  completed = signal(0);
  
  // Form for creating new tasks
  taskForm: FormGroup;
  
  constructor(private fb: FormBuilder, private taskService: TaskService) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      dueDate: [''],
      description: [''],
      priority: ['Medium Priority']
    });
  }
  
  // Create new task
  createTask() {
    if (this.taskForm.valid) {
      const formValues = this.taskForm.value;
      
      // Set default due date to 7 days from today if not provided
      let dueDate = formValues.dueDate;
      if (!dueDate) {
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 7);
        dueDate = defaultDate.toISOString().split('T')[0];
      }
      
      // Set default description if not provided
      const description = formValues.description || 'No Description provided';
      
      // Add task to the service
      this.taskService.addTask({
        title: formValues.title,
        dueDate: dueDate,
        description: description,
        priority: formValues.priority,
        status: 'pending'
      });
      
      this.updateTaskCounts();
      this.taskForm.reset({ priority: 'Medium Priority' });
    } else {
      this.markFormGroupTouched();
    }
  }
  
  // Update task counts
  updateTaskCounts() {
    const today = new Date().toDateString();
    const allTasks = this.taskService.tasks();
    
    this.tasksToday.set(allTasks.filter(task => 
      new Date(task.dueDate).toDateString() === today
    ).length);
    
    this.inProgress.set(allTasks.filter(task => 
      task.status === 'in-progress'
    ).length);
    
    this.completed.set(allTasks.filter(task => 
      task.status === 'completed'
    ).length);
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

  ngOnInit() {
    this.updateTaskCounts();
  }
}
