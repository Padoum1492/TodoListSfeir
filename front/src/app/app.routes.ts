import { Routes } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'all', pathMatch: 'full' },
  { path: 'all', component: TodoListComponent, data: { filter: 'all' } },
  { path: 'in-progress', component: TodoListComponent, data: { filter: 'in-progress' } },
  { path: 'done', component: TodoListComponent, data: { filter: 'done' } },
  { path: '**', redirectTo: 'all' },
];
