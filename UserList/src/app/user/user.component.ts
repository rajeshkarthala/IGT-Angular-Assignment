import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  users: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'status'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource(this.users);
  @ViewChild(MatSort, {static: false}) sort!: MatSort;
  pageSize = 3;
  currentPage = 0;

  @ViewChild('input') input: any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.http.get('https://gorest.co.in/public-api/users')
      .subscribe((response: any) => {
        this.users = response.data;
        this.loadMore();
        this.dataSource.sort = this.sort;
      }, error => {
        console.error('Error fetching users:', error);
      });
  }

  loadMore() {
    const nextPageData = this.users
      .slice(this.currentPage * this.pageSize, (this.currentPage + 1) * this.pageSize);
    this.dataSource.data = this.dataSource.data.concat(nextPageData);
    this.currentPage++;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}