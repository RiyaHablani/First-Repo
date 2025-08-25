import { Injectable, signal } from '@angular/core';

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  createdAt: Date;
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly STORAGE_KEY = 'task-manager-tasks';
  
  // Shared tasks signal
  private _tasks = signal<Task[]>(this.loadTasksFromStorage());

  // Public getter for tasks
  get tasks() {
    return this._tasks.asReadonly();
  }

  // Load tasks from localStorage (JSON)
  private loadTasksFromStorage(): Task[] {
    try {
      const storedTasks = localStorage.getItem(this.STORAGE_KEY);
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        // Convert date strings back to Date objects using custom parser
        return parsedTasks.map((task: any) => ({
          ...task,
          createdAt: this.parseDateFromStorage(task.createdAt),
          lastUpdated: this.parseDateFromStorage(task.lastUpdated)
        }));
      }
    } catch (error) {
      console.error('Error loading tasks from storage:', error);
    }
    
    // Return default tasks if no stored data
    return this.getDefaultTasks();
  }

  // Save tasks to localStorage (JSON)
  private saveTasksToStorage(tasks: Task[]): void {
    try {
      // Convert dates to readable format before saving
      const tasksForStorage = tasks.map(task => ({
        ...task,
        createdAt: this.formatDateForStorage(task.createdAt),
        lastUpdated: this.formatDateForStorage(task.lastUpdated)
      }));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasksForStorage));
    } catch (error) {
      console.error('Error saving tasks to storage:', error);
    }
  }

  // Format date for storage (readable format)
  private formatDateForStorage(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  // Parse date from storage
  private parseDateFromStorage(dateString: string): Date {
    return new Date(dateString);
  }

  // Get default tasks for initial setup (JSON format)
  private getDefaultTasks(): Task[] {
    const defaultTasksJSON = `[{"id":1,"title":"Test","description":"No description provided","status":"pending","priority":"Low Priority","dueDate":"2025-08-25","createdAt":"01/10/2024, 09:00:00 AM","lastUpdated":"01/10/2024, 09:00:00 AM"},{"id":2,"title":"Complete project proposal","description":"Draft the initial project proposal for the new client","status":"in-progress","priority":"High Priority","dueDate":"2024-08-25","createdAt":"01/12/2024, 02:30:00 PM","lastUpdated":"01/12/2024, 02:30:00 PM"},{"id":3,"title":"Review code changes","description":"Review pull requests and provide feedback to team members","status":"completed","priority":"Medium Priority","dueDate":"2024-08-20","createdAt":"01/08/2024, 11:15:00 AM","lastUpdated":"01/08/2024, 11:15:00 AM"},{"id":4,"title":"Schedule team meeting","description":"Organize weekly team meeting and send out invitations","status":"pending","priority":"Low Priority","dueDate":"2024-08-18","createdAt":"01/15/2024, 04:45:00 PM","lastUpdated":"01/15/2024, 04:45:00 PM"}]`;

    try {
      // Parse JSON and convert date strings to Date objects
      const parsedTasks = JSON.parse(defaultTasksJSON);
      return parsedTasks.map((task: any) => ({
        ...task,
        createdAt: this.parseDateFromStorage(task.createdAt),
        lastUpdated: this.parseDateFromStorage(task.lastUpdated)
      }));
    } catch (error) {
      console.error('Error parsing default tasks JSON:', error);
      // Fallback to empty array if JSON parsing fails
      return [];
    }
  }

  // Add new task
  addTask(task: Omit<Task, 'id' | 'createdAt' | 'lastUpdated'>) {
    const newTask: Task = {
      ...task,
      id: Date.now(),
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    
    this._tasks.update(tasks => {
      const updatedTasks = [newTask, ...tasks];
      this.saveTasksToStorage(updatedTasks);
      return updatedTasks;
    });
  }

  // Update task status
  updateTaskStatus(taskId: number, newStatus: string) {
    this._tasks.update(tasks => {
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus, lastUpdated: new Date() } : task
      );
      this.saveTasksToStorage(updatedTasks);
      return updatedTasks;
    });
  }

  // Delete task
  deleteTask(taskId: number) {
    this._tasks.update(tasks => {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      this.saveTasksToStorage(updatedTasks);
      return updatedTasks;
    });
  }

  // Get task by ID
  getTaskById(taskId: number): Task | undefined {
    return this._tasks().find(task => task.id === taskId);
  }

  // Update task
  updateTask(taskId: number, updatedTask: Partial<Task>) {
    this._tasks.update(tasks => {
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, ...updatedTask, lastUpdated: new Date() } : task
      );
      this.saveTasksToStorage(updatedTasks);
      return updatedTasks;
    });
  }

  // Export tasks as JSON
  exportTasksAsJSON(): string {
    return JSON.stringify(this._tasks(), null, 2);
  }

  // Import tasks from JSON
  importTasksFromJSON(jsonString: string): boolean {
    try {
      const parsedTasks = JSON.parse(jsonString);
      const tasksWithDates = parsedTasks.map((task: any) => ({
        ...task,
        createdAt: this.parseDateFromStorage(task.createdAt),
        lastUpdated: this.parseDateFromStorage(task.lastUpdated)
      }));
      
      this._tasks.set(tasksWithDates);
      this.saveTasksToStorage(tasksWithDates);
      return true;
    } catch (error) {
      console.error('Error importing tasks from JSON:', error);
      return false;
    }
  }
}
