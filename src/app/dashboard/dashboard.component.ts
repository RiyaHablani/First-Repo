import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  // Search and filter properties
  searchTerm = '';
  selectedStatus = 'All Status';
  selectedPriority = 'All Priorities';
  
  constructor(private taskService: TaskService, private router: Router) {}
  
  // Task data - get from service
  get tasks() {
    return this.taskService.tasks;
  }

  // Computed properties for statistics
  get totalTasks() {
    return this.tasks().length;
  }

  get pendingTasks() {
    return this.tasks().filter(task => task.status === 'pending').length;
  }

  get inProgressTasks() {
    return this.tasks().filter(task => task.status === 'in-progress').length;
  }

  get completedTasks() {
    return this.tasks().filter(task => task.status === 'completed').length;
  }

  // Filter options
  statusOptions = ['All Status', 'pending', 'in-progress', 'completed'];
  priorityOptions = ['All Priorities', 'low', 'medium', 'high'];

  // Filtered tasks based on search and filters
  get filteredTasks() {
    let filtered = this.tasks();

    // Search filter
    if (this.searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (this.selectedStatus !== 'All Status') {
      filtered = filtered.filter(task => task.status === this.selectedStatus);
    }

    // Priority filter
    if (this.selectedPriority !== 'All Priorities') {
      filtered = filtered.filter(task => task.priority === this.selectedPriority);
    }

    return filtered;
  }

  // Update task status
  updateTaskStatus(taskId: number, newStatus: string) {
    this.taskService.updateTaskStatus(taskId, newStatus);
  }

  // Handle status change event
  onStatusChange(event: Event, taskId: number) {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.updateTaskStatus(taskId, target.value);
    }
  }

  // Delete task
  deleteTask(taskId: number) {
    this.taskService.deleteTask(taskId);
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

  // Get priority color class
  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }

  // Get status color class
  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  // Navigate to task detail
  navigateToTaskDetail(taskId: number) {
    this.router.navigate(['/task', taskId]);
  }
}
