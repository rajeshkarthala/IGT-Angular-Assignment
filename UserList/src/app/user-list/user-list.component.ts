import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../shared/models/user.model';
import { UserSharedService } from '../shared/services/user-shared-service';
import { MatCardModule } from '@angular/material/card';
@Component({
  standalone: true,
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  imports: [CommonModule, MatCardModule]
})
export class UserListComponent implements OnInit {
  selectedUser: User[] = [];

  constructor(private route: ActivatedRoute,private userSharedService: UserSharedService,private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let userId = params.get('userId');
      this.selectedUser = this.userSharedService.getFilteredUsersById(parseInt(userId!));
    });
  }

  navigateBack() {
    this.router.navigate(['/user']);
  }
}