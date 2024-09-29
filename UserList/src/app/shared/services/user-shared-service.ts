import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { MatTableDataSource } from '@angular/material/table';

@Injectable({
  providedIn: 'root'
})
export class UserSharedService {
  filteredUsers: User[] = [];
  dataSource: CustomMatTableDataSource<User> | null = null;

  constructor() { }

  setDataSource(dataSource: MatTableDataSource<User> | null) {
    if(!!dataSource){
    this.dataSource = new CustomMatTableDataSource<User>([...dataSource.data]);
    this.dataSource.sort = dataSource.sort;
    this.dataSource.filter = dataSource.filter;
    this.dataSource.sortingDataAccessor = dataSource.sortingDataAccessor;
    this.dataSource.filterPredicate = dataSource.filterPredicate;
    }
  }

  getDataSource(): CustomMatTableDataSource<User> | null {
    return this.dataSource;
  }

  getFilteredUsersById( userId: number ) : User[] {
    return this.dataSource!.data.filter( user => user.id === userId );
  }

}
class CustomMatTableDataSource<T> extends MatTableDataSource<T> {
}
