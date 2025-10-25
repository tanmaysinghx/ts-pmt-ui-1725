import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface BuildStage {
  name: string;
  status: 'success' | 'failure' | 'running' | 'pending';
  progress: number;
  duration: string;
  startTime: Date;
  endTime?: Date;
  error?: string;
}

interface Pipeline {
  id: string;
  name: string;
  serviceName: string;
  environment: string;
  status: 'SUCCESS' | 'FAILURE' | 'RUNNING' | 'PENDING';
  lastBuild: Date;
  version: string;
  duration: string;
  progress: number;
  stages: BuildStage[];
  commitHash: string;
  triggeredBy: string;
  branch: string;
}

@Component({
  selector: 'app-pipeline-overview',
  templateUrl: './pipeline-overview.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PipelineOverviewComponent implements OnInit {
  pipelines: Pipeline[] = [];
  filteredPipelines: Pipeline[] = [];
  selectedEnvironment: string = '';
  selectedStatus: string = '';
  searchQuery: string = '';
  expandedPipeline: string | null = null;
  viewMode: 'list' | 'compact' = 'list';

  ngOnInit(): void {
    this.loadPipelines();
    this.filteredPipelines = [...this.pipelines];
  }

  constructor(private readonly router: Router) {}

  loadPipelines(): void {
    this.pipelines = [
      {
        id: '1',
        name: 'Auth Service',
        serviceName: 'authentication-api',
        environment: 'Dev',
        status: 'SUCCESS',
        lastBuild: new Date('2025-10-25T11:30:00'),
        version: 'v1.2.3',
        duration: '5m 45s',
        progress: 100,
        branch: 'main',
        stages: [
          { name: 'Checkout', status: 'success', progress: 100, duration: '15s', startTime: new Date('2025-10-25T11:30:00'), endTime: new Date('2025-10-25T11:30:15') },
          { name: 'Build', status: 'success', progress: 100, duration: '2m 10s', startTime: new Date('2025-10-25T11:30:15'), endTime: new Date('2025-10-25T11:32:25') },
          { name: 'Unit Test', status: 'success', progress: 100, duration: '1m 20s', startTime: new Date('2025-10-25T11:32:25'), endTime: new Date('2025-10-25T11:33:45') },
          { name: 'Integration Test', status: 'success', progress: 100, duration: '1m 30s', startTime: new Date('2025-10-25T11:33:45'), endTime: new Date('2025-10-25T11:35:15') },
          { name: 'Deploy', status: 'success', progress: 100, duration: '30s', startTime: new Date('2025-10-25T11:35:15'), endTime: new Date('2025-10-25T11:35:45') }
        ],
        commitHash: 'a3b4c5d',
        triggeredBy: 'john.doe@example.com'
      },
      {
        id: '2',
        name: 'Profile Service',
        serviceName: 'user-profile-api',
        environment: 'QA',
        status: 'FAILURE',
        lastBuild: new Date('2025-10-25T10:15:00'),
        version: 'v2.0.1',
        duration: '3m 25s',
        progress: 60,
        branch: 'develop',
        stages: [
          { name: 'Checkout', status: 'success', progress: 100, duration: '12s', startTime: new Date('2025-10-25T10:15:00'), endTime: new Date('2025-10-25T10:15:12') },
          { name: 'Build', status: 'success', progress: 100, duration: '1m 45s', startTime: new Date('2025-10-25T10:15:12'), endTime: new Date('2025-10-25T10:16:57') },
          { name: 'Unit Test', status: 'failure', progress: 100, duration: '1m 28s', startTime: new Date('2025-10-25T10:16:57'), endTime: new Date('2025-10-25T10:18:25'), error: 'Test assertion failed: Expected 200, got 404' },
          { name: 'Integration Test', status: 'pending', progress: 0, duration: '-', startTime: new Date('2025-10-25T10:18:25') },
          { name: 'Deploy', status: 'pending', progress: 0, duration: '-', startTime: new Date('2025-10-25T10:18:25') }
        ],
        commitHash: 'f8e7d6c',
        triggeredBy: 'jane.smith@example.com'
      },
      {
        id: '3',
        name: 'Payment Gateway',
        serviceName: 'payment-service',
        environment: 'Production',
        status: 'RUNNING',
        lastBuild: new Date('2025-10-25T12:00:00'),
        version: 'v3.1.0',
        duration: '4m 20s',
        progress: 75,
        branch: 'release/v3.1.0',
        stages: [
          { name: 'Checkout', status: 'success', progress: 100, duration: '18s', startTime: new Date('2025-10-25T12:00:00'), endTime: new Date('2025-10-25T12:00:18') },
          { name: 'Build', status: 'success', progress: 100, duration: '2m 30s', startTime: new Date('2025-10-25T12:00:18'), endTime: new Date('2025-10-25T12:02:48') },
          { name: 'Unit Test', status: 'success', progress: 100, duration: '1m 10s', startTime: new Date('2025-10-25T12:02:48'), endTime: new Date('2025-10-25T12:03:58') },
          { name: 'Security Scan', status: 'running', progress: 65, duration: '-', startTime: new Date('2025-10-25T12:03:58') },
          { name: 'Deploy', status: 'pending', progress: 0, duration: '-', startTime: new Date('2025-10-25T12:03:58') }
        ],
        commitHash: 'b2c3d4e',
        triggeredBy: 'admin@example.com'
      },
      {
        id: '4',
        name: 'Notification Service',
        serviceName: 'notification-api',
        environment: 'Staging',
        status: 'SUCCESS',
        lastBuild: new Date('2025-10-25T09:45:00'),
        version: 'v1.5.2',
        duration: '4m 15s',
        progress: 100,
        branch: 'main',
        stages: [
          { name: 'Checkout', status: 'success', progress: 100, duration: '14s', startTime: new Date('2025-10-25T09:45:00'), endTime: new Date('2025-10-25T09:45:14') },
          { name: 'Build', status: 'success', progress: 100, duration: '1m 50s', startTime: new Date('2025-10-25T09:45:14'), endTime: new Date('2025-10-25T09:47:04') },
          { name: 'Unit Test', status: 'success', progress: 100, duration: '55s', startTime: new Date('2025-10-25T09:47:04'), endTime: new Date('2025-10-25T09:47:59') },
          { name: 'Code Quality', status: 'success', progress: 100, duration: '45s', startTime: new Date('2025-10-25T09:47:59'), endTime: new Date('2025-10-25T09:48:44') },
          { name: 'Deploy', status: 'success', progress: 100, duration: '31s', startTime: new Date('2025-10-25T09:48:44'), endTime: new Date('2025-10-25T09:49:15') }
        ],
        commitHash: 'e5f6g7h',
        triggeredBy: 'alice.jones@example.com'
      },
      {
        id: '5',
        name: 'Analytics Engine',
        serviceName: 'analytics-service',
        environment: 'Dev',
        status: 'PENDING',
        lastBuild: new Date('2025-10-25T08:20:00'),
        version: 'v2.3.1',
        duration: '-',
        progress: 0,
        branch: 'feature/analytics-v2',
        stages: [
          { name: 'Checkout', status: 'pending', progress: 0, duration: '-', startTime: new Date('2025-10-25T08:20:00') },
          { name: 'Build', status: 'pending', progress: 0, duration: '-', startTime: new Date('2025-10-25T08:20:00') },
          { name: 'Test', status: 'pending', progress: 0, duration: '-', startTime: new Date('2025-10-25T08:20:00') },
          { name: 'Deploy', status: 'pending', progress: 0, duration: '-', startTime: new Date('2025-10-25T08:20:00') }
        ],
        commitHash: 'h8i9j0k',
        triggeredBy: 'bob.wilson@example.com'
      },
      {
        id: '6',
        name: 'File Storage API',
        serviceName: 'storage-api',
        environment: 'QA',
        status: 'SUCCESS',
        lastBuild: new Date('2025-10-25T11:00:00'),
        version: 'v1.8.0',
        duration: '6m 20s',
        progress: 100,
        branch: 'main',
        stages: [
          { name: 'Checkout', status: 'success', progress: 100, duration: '20s', startTime: new Date('2025-10-25T11:00:00'), endTime: new Date('2025-10-25T11:00:20') },
          { name: 'Build', status: 'success', progress: 100, duration: '2m 45s', startTime: new Date('2025-10-25T11:00:20'), endTime: new Date('2025-10-25T11:03:05') },
          { name: 'Unit Test', status: 'success', progress: 100, duration: '1m 15s', startTime: new Date('2025-10-25T11:03:05'), endTime: new Date('2025-10-25T11:04:20') },
          { name: 'Integration Test', status: 'success', progress: 100, duration: '1m 40s', startTime: new Date('2025-10-25T11:04:20'), endTime: new Date('2025-10-25T11:06:00') },
          { name: 'Deploy', status: 'success', progress: 100, duration: '20s', startTime: new Date('2025-10-25T11:06:00'), endTime: new Date('2025-10-25T11:06:20') }
        ],
        commitHash: 'k1l2m3n',
        triggeredBy: 'charlie@example.com'
      }
    ];
  }

  filterPipelines(): void {
    this.filteredPipelines = this.pipelines.filter(pipeline => {
      const matchesEnv = !this.selectedEnvironment || pipeline.environment === this.selectedEnvironment;
      const matchesStatus = !this.selectedStatus || pipeline.status === this.selectedStatus;
      const matchesSearch = !this.searchQuery ||
        pipeline.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        pipeline.serviceName.toLowerCase().includes(this.searchQuery.toLowerCase());

      return matchesEnv && matchesStatus && matchesSearch;
    });
  }

  toggleDetails(pipelineId: string): void {
    this.expandedPipeline = this.expandedPipeline === pipelineId ? null : pipelineId;
  }

  refreshPipelines(): void {
    console.log('Refreshing pipelines...');
    this.loadPipelines();
    this.filterPipelines();
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }

  getSuccessRate(): number {
    const successCount = this.pipelines.filter(p => p.status === 'SUCCESS').length;
    return Math.round((successCount / this.pipelines.length) * 100);
  }

  getRunningCount(): number {
    return this.pipelines.filter(p => p.status === 'RUNNING').length;
  }

  getFailedCount(): number {
    return this.pipelines.filter(p => p.status === 'FAILURE').length;
  }

  getAvgDuration(): string {
    const completedPipelines = this.pipelines.filter(p => p.duration !== '-');
    if (completedPipelines.length === 0) return '-';

    const totalSeconds = completedPipelines.reduce((sum, p) => {
      const [time, unit] = p.duration.split(' ');
      const [minutes, seconds] = time.includes('m') ? time.split('m') : ['0', time];
      return sum + (parseInt(minutes) * 60) + (parseInt(seconds.replace('s', '')) || 0);
    }, 0);

    const avgSeconds = Math.floor(totalSeconds / completedPipelines.length);
    const mins = Math.floor(avgSeconds / 60);
    const secs = avgSeconds % 60;
    return `${mins}m ${secs}s`;
  }

  getStatusBarClass(status: string): string {
    const classes: Record<string, string> = {
      'SUCCESS': 'bg-green-500',
      'FAILURE': 'bg-red-500',
      'RUNNING': 'bg-yellow-500',
      'PENDING': 'bg-gray-400'
    };
    return classes[status] || 'bg-blue-500';
  }

  getIconBgClass(status: string): string {
    const classes: Record<string, string> = {
      'SUCCESS': 'bg-green-500',
      'FAILURE': 'bg-red-500',
      'RUNNING': 'bg-yellow-500',
      'PENDING': 'bg-gray-400'
    };
    return classes[status] || 'bg-blue-500';
  }

  getStatusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      'SUCCESS': 'bg-green-100 text-green-700',
      'FAILURE': 'bg-red-100 text-red-700',
      'RUNNING': 'bg-yellow-100 text-yellow-700',
      'PENDING': 'bg-gray-100 text-gray-700'
    };
    return classes[status] || 'bg-blue-100 text-blue-700';
  }

  getStageProgressClass(status: string): string {
    const classes: Record<string, string> = {
      'success': 'bg-green-500',
      'failure': 'bg-red-500',
      'running': 'bg-yellow-500',
      'pending': 'bg-gray-300'
    };
    return classes[status] || 'bg-blue-500';
  }

  getStageIcon(status: string): string {
    const icons: Record<string, string> = {
      'success': '✔',
      'failure': '❌',
      'running': '⏳',
      'pending': '○'
    };
    return icons[status] || '○';
  }

  getStageTextClass(status: string): string {
    const classes: Record<string, string> = {
      'success': 'text-green-700',
      'failure': 'text-red-700',
      'running': 'text-yellow-700',
      'pending': 'text-gray-500'
    };
    return classes[status] || 'text-gray-700';
  }

  viewDetails(pipeline: Pipeline): void {
    this.router.navigate(['/pipelines/pipelines-execution', pipeline.id]);
  }

  viewLogs(pipeline: Pipeline): void {
    console.log('View logs:', pipeline);
    // Open logs viewer
  }

  retrigger(pipeline: Pipeline): void {
    console.log('Retrigger pipeline:', pipeline);
    // Call API to retrigger pipeline
  }

  cancelPipeline(pipeline: Pipeline): void {
    const confirmed = confirm(`Are you sure you want to cancel pipeline: ${pipeline.name}?`);
    if (confirmed) {
      console.log('Cancel pipeline:', pipeline);
      // Call API to cancel pipeline
    }
  }
}