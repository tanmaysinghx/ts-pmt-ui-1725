import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { BuildParametersModalComponent } from "../build-parameters-modal/build-parameters-modal.component";

interface ConsoleLog {
  timestamp: Date;
  type: 'info' | 'error' | 'warning' | 'success';
  message: string;
}

interface Stage {
  id: string;
  name: string;
  status: 'success' | 'failure' | 'running' | 'pending';
  progress: number;
  duration: string;
  startTime: Date;
  endTime?: Date;
  error?: string;
  logs: ConsoleLog[];
}

interface Build {
  buildNumber: number;
  status: 'SUCCESS' | 'FAILURE' | 'RUNNING' | 'PENDING';
  duration: string;
  triggeredBy: string;
  startTime: Date;
  commitHash: string;
  stages: Stage[];
}

interface Pipeline {
  id: string;
  name: string;
  serviceName: string;
  branch: string;
  environment: string;
}

@Component({
  selector: 'app-pipeline-execution',
  templateUrl: './pipeline-execution.component.html',
  standalone: true,
  imports: [CommonModule, BuildParametersModalComponent]
})
export class PipelineExecutionComponent implements OnInit {
  pipeline: Pipeline | null = null;
  currentBuild: Build | null = null;
  buildHistory: Build[] = [];
  stages: Stage[] = [];
  selectedStage: Stage | null = null;
  isRunning: boolean = false;
  
  // Modal state
  showParametersModal: boolean = false;
  buildParameters: any = null;
  
  private buildSubscription: Subscription | null = null;
  private currentStageIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const pipelineId = this.route.snapshot.params['pipelineId'];
    this.loadPipeline(pipelineId);
    this.loadBuildHistory();
  }

  ngOnDestroy(): void {
    if (this.buildSubscription) {
      this.buildSubscription.unsubscribe();
    }
  }

  loadPipeline(id: string): void {
    // Simulate loading pipeline data
    this.pipeline = {
      id: id,
      name: 'Auth Service',
      serviceName: 'authentication-api',
      branch: 'main',
      environment: 'Dev'
    };

    this.initializeStages();
  }

  initializeStages(): void {
    this.stages = [
      {
        id: '1',
        name: 'Checkout',
        status: 'pending',
        progress: 0,
        duration: '-',
        startTime: new Date(),
        logs: []
      },
      {
        id: '2',
        name: 'Build',
        status: 'pending',
        progress: 0,
        duration: '-',
        startTime: new Date(),
        logs: []
      },
      {
        id: '3',
        name: 'Unit Test',
        status: 'pending',
        progress: 0,
        duration: '-',
        startTime: new Date(),
        logs: []
      },
      {
        id: '4',
        name: 'Integration Test',
        status: 'pending',
        progress: 0,
        duration: '-',
        startTime: new Date(),
        logs: []
      },
      {
        id: '5',
        name: 'Security Scan',
        status: 'pending',
        progress: 0,
        duration: '-',
        startTime: new Date(),
        logs: []
      },
      {
        id: '6',
        name: 'Deploy',
        status: 'pending',
        progress: 0,
        duration: '-',
        startTime: new Date(),
        logs: []
      }
    ];
  }

  loadBuildHistory(): void {
    this.buildHistory = [
      {
        buildNumber: 125,
        status: 'SUCCESS',
        duration: '5m 45s',
        triggeredBy: 'john.doe@example.com',
        startTime: new Date('2025-10-25T11:30:00'),
        commitHash: 'a3b4c5d',
        stages: []
      },
      {
        buildNumber: 124,
        status: 'FAILURE',
        duration: '3m 25s',
        triggeredBy: 'jane.smith@example.com',
        startTime: new Date('2025-10-25T10:15:00'),
        commitHash: 'f8e7d6c',
        stages: []
      },
      {
        buildNumber: 123,
        status: 'SUCCESS',
        duration: '4m 50s',
        triggeredBy: 'admin@example.com',
        startTime: new Date('2025-10-25T09:20:00'),
        commitHash: 'b2c3d4e',
        stages: []
      },
      {
        buildNumber: 122,
        status: 'SUCCESS',
        duration: '5m 10s',
        triggeredBy: 'alice.jones@example.com',
        startTime: new Date('2025-10-25T08:45:00'),
        commitHash: 'e5f6g7h',
        stages: []
      },
      {
        buildNumber: 121,
        status: 'FAILURE',
        duration: '2m 30s',
        triggeredBy: 'bob.wilson@example.com',
        startTime: new Date('2025-10-25T07:30:00'),
        commitHash: 'h8i9j0k',
        stages: []
      }
    ];
  }

  // UPDATED: Show modal instead of starting build directly
  triggerPipeline(): void {
    if (this.isRunning) return;
    
    // Show parameters modal
    this.showParametersModal = true;
  }

  // Close modal
  closeParametersModal(): void {
    this.showParametersModal = false;
  }

  // Trigger with parameters
  triggerPipelineWithParams(params: any): void {
    console.log('Build triggered with parameters:', params);
    this.buildParameters = params;
    
    // Start the build with parameters
    this.startBuildExecution();
  }

  // NEW: Actual build execution
  startBuildExecution(): void {
    this.isRunning = true;
    this.currentStageIndex = 0;
    
    // Initialize new build
    this.currentBuild = {
      buildNumber: this.buildHistory.length > 0 ? this.buildHistory[0].buildNumber + 1 : 1,
      status: 'RUNNING',
      duration: '0s',
      triggeredBy: 'current.user@example.com',
      startTime: new Date(),
      commitHash: this.generateCommitHash(),
      stages: [...this.stages]
    };

    // Log build parameters
    if (this.buildParameters) {
      console.log('Build parameters:', this.buildParameters);
    }

    // Reset all stages
    this.initializeStages();
    
    // Start build simulation
    this.runNextStage();
  }

  runNextStage(): void {
    if (this.currentStageIndex >= this.stages.length) {
      this.completeBuild();
      return;
    }

    const stage = this.stages[this.currentStageIndex];
    stage.status = 'running';
    stage.progress = 0;
    stage.startTime = new Date();
    
    stage.logs.push({
      timestamp: new Date(),
      type: 'info',
      message: `Starting ${stage.name} stage...`
    });

    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 100) progress = 100;
      
      stage.progress = Math.floor(progress);
      
      if (Math.random() > 0.7) {
        stage.logs.push(this.generateRandomLog(stage.name));
      }

      if (progress >= 100) {
        clearInterval(progressInterval);
        
        const isSuccess = Math.random() > 0.1;
        
        if (isSuccess) {
          stage.status = 'success';
          stage.endTime = new Date();
          stage.duration = this.calculateDuration(stage.startTime, stage.endTime);
          stage.logs.push({
            timestamp: new Date(),
            type: 'success',
            message: `${stage.name} completed successfully ✓`
          });
          
          this.currentStageIndex++;
          setTimeout(() => this.runNextStage(), 1000);
        } else {
          stage.status = 'failure';
          stage.endTime = new Date();
          stage.duration = this.calculateDuration(stage.startTime, stage.endTime);
          stage.error = this.generateRandomError(stage.name);
          stage.logs.push({
            timestamp: new Date(),
            type: 'error',
            message: `ERROR: ${stage.error}`
          });
          
          this.failBuild();
        }
      }
    }, 500);
  }

  completeBuild(): void {
    this.isRunning = false;
    
    if (this.currentBuild) {
      this.currentBuild.status = 'SUCCESS';
      this.currentBuild.duration = this.calculateDuration(
        this.currentBuild.startTime,
        new Date()
      );
      
      this.buildHistory.unshift({ ...this.currentBuild });
    }
  }

  failBuild(): void {
    this.isRunning = false;
    
    if (this.currentBuild) {
      this.currentBuild.status = 'FAILURE';
      this.currentBuild.duration = this.calculateDuration(
        this.currentBuild.startTime,
        new Date()
      );
      
      for (let i = this.currentStageIndex + 1; i < this.stages.length; i++) {
        this.stages[i].status = 'pending';
      }
      
      this.buildHistory.unshift({ ...this.currentBuild });
    }
  }

  stopPipeline(): void {
    if (!this.isRunning) return;

    const confirmed = confirm('Are you sure you want to stop this build?');
    if (confirmed) {
      this.isRunning = false;
      
      if (this.currentStageIndex < this.stages.length) {
        const stage = this.stages[this.currentStageIndex];
        stage.status = 'failure';
        stage.endTime = new Date();
        stage.duration = this.calculateDuration(stage.startTime, stage.endTime);
        stage.error = 'Build cancelled by user';
        stage.logs.push({
          timestamp: new Date(),
          type: 'error',
          message: 'Build cancelled by user'
        });
      }
      
      if (this.currentBuild) {
        this.currentBuild.status = 'FAILURE';
        this.currentBuild.duration = this.calculateDuration(
          this.currentBuild.startTime,
          new Date()
        );
        this.buildHistory.unshift({ ...this.currentBuild });
      }
    }
  }

  selectStage(stage: Stage): void {
    this.selectedStage = stage;
  }

  loadBuild(build: Build): void {
    console.log('Load build:', build);
  }

  goBack(): void {
    this.router.navigate(['/pipelines']);
  }

  generateCommitHash(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  calculateDuration(start: Date, end: Date): string {
    const diffMs = end.getTime() - start.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const mins = Math.floor(diffSecs / 60);
    const secs = diffSecs % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }

  generateRandomLog(stageName: string): ConsoleLog {
    const logMessages = [
      `Executing ${stageName} tasks...`,
      `Processing dependencies...`,
      `Running scripts...`,
      `Compiling source code...`,
      `Installing packages...`,
      `Running tests...`,
      `Analyzing code quality...`,
      `Packaging artifacts...`,
      `Uploading to repository...`,
      `Validating configuration...`
    ];

    const types: Array<'info' | 'warning' | 'success'> = ['info', 'info', 'info', 'warning', 'success'];
    
    return {
      timestamp: new Date(),
      type: types[Math.floor(Math.random() * types.length)],
      message: logMessages[Math.floor(Math.random() * logMessages.length)]
    };
  }

  generateRandomError(stageName: string): string {
    const errors = [
      `Test assertion failed: Expected 200, got 404`,
      `Compilation error: Cannot find module 'express'`,
      `Security vulnerability detected in package xyz@1.2.3`,
      `Unit test failed: Authentication.test.ts:45`,
      `Deployment failed: Connection timeout to server`,
      `Code quality check failed: Cyclomatic complexity too high`,
      `Integration test failed: Database connection refused`,
      `Build timeout: Process exceeded 10 minutes`
    ];
    
    return errors[Math.floor(Math.random() * errors.length)];
  }

  getStageBoxClass(status: string): string {
    const classes: Record<string, string> = {
      'success': 'bg-green-50 border-green-300 hover:bg-green-100',
      'failure': 'bg-red-50 border-red-300 hover:bg-red-100',
      'running': 'bg-blue-50 border-blue-300 hover:bg-blue-100',
      'pending': 'bg-gray-50 border-gray-300 hover:bg-gray-100'
    };
    return classes[status] || 'bg-gray-50 border-gray-300';
  }

  getStageTextClass(status: string): string {
    const classes: Record<string, string> = {
      'success': 'text-green-700',
      'failure': 'text-red-700',
      'running': 'text-blue-700',
      'pending': 'text-gray-500'
    };
    return classes[status] || 'text-gray-700';
  }

  getStatusTextClass(status: string): string {
    const classes: Record<string, string> = {
      'SUCCESS': 'text-green-700',
      'FAILURE': 'text-red-700',
      'RUNNING': 'text-blue-700',
      'PENDING': 'text-gray-500'
    };
    return classes[status] || 'text-gray-700';
  }

  getStatusBadgeClass(status: string): string {
    const classes: Record<string, string> = {
      'SUCCESS': 'bg-green-100 text-green-700',
      'FAILURE': 'bg-red-100 text-red-700',
      'RUNNING': 'bg-blue-100 text-blue-700',
      'PENDING': 'bg-gray-100 text-gray-700'
    };
    return classes[status] || 'bg-gray-100 text-gray-700';
  }

  getLogTypeClass(type: string): string {
    const classes: Record<string, string> = {
      'info': 'text-green-400',
      'error': 'text-red-400',
      'warning': 'text-yellow-400',
      'success': 'text-green-300'
    };
    return classes[type] || 'text-green-400';
  }
}