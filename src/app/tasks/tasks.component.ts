import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tasks',
  imports: [CommonModule, RouterLink],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {
  // Sample tasks data
  tasks = [
    {
      id: 1,
      title: 'Complete project documentation',
      description: 'Write comprehensive documentation for the new project features',
      dueDate: '2024-01-15',
      priority: 'High',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Review code changes',
      description: 'Review pull requests and provide feedback to team members',
      dueDate: '2024-01-20',
      priority: 'Medium',
      status: 'in-progress'
    },
    {
      id: 3,
      title: 'Schedule team meeting',
      description: 'Organize weekly team meeting and send out invitations',
      dueDate: '2024-01-18',
      priority: 'Low',
      status: 'pending'
    },
    {
      id: 4,
      title: 'Update user interface',
      description: 'Implement new UI components based on design feedback',
      dueDate: '2024-01-25',
      priority: 'High',
      status: 'completed'
    },
    {
      id: 5,
      title: 'Fix bug in login system',
      description: 'Resolve authentication issues reported by users',
      dueDate: '2024-01-22',
      priority: 'High',
      status: 'in-progress'
    }
  ];

  getTasksByStatus(status: string) {
    return this.tasks.filter(task => task.status === status);
  }
}
