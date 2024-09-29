import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UserService } from './user.service';
import { User } from '../shared/models/user.model';
import { UserSharedService } from '../shared/services/user-shared-service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: true,
  providers:[UserService],
  imports: [
    CommonModule,
    HttpClientModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinnerModule
  ]
})
export class UserComponent implements OnInit, AfterViewInit {
  users: User[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'status'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource(this.users);
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  pageSize = 3;
  currentPage = 0;
  @ViewChild('input') input: any;
  previousState: any;
  maxRecordsReached: boolean = false;
  isLoading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private userService: UserService,private userSharedService: UserSharedService, private router: Router) {}

  ngOnInit(): void {
      this.previousState = this.userSharedService.getDataSource();
      this.fetchUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;    
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.users = response.data;
          this.loadTableData();
        },
        error: (e) => console.error("Error fetching users:", e),
        complete: () => {
          this.isLoading = false;
          console.info('complete')}
      });
  }

  loadTableData(){
    if(!!this.previousState) {
      this.dataSource = this.previousState;
      this.currentPage = Math.floor(this.dataSource.data.length / this.pageSize);
      this.sort = this.dataSource.sort!;
      this.input.nativeElement.value = this.dataSource.filter;
    }else{
      this.loadMore();
    }
  }

  loadMore() {
    if (this.currentPage * this.pageSize >= this.users.length) {
      this.maxRecordsReached = true;
    } else {
      let userListData = [...this.users];
      const nextPageData = userListData
        .slice(this.currentPage * this.pageSize, (this.currentPage + 1) * this.pageSize);
      this.dataSource.data = this.dataSource.data.concat(nextPageData);
      this.currentPage++;
      this.userSharedService.setDataSource(this.dataSource);
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.userSharedService.setDataSource(this.dataSource);
  }

  navigateToUser(userId: number): void {
    this.router.navigate(['/user', userId]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}