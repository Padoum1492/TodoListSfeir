import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/todos';

  todos = signal<Todo[]>([]);
  error = signal<string | null>(null);

  loadTodos() {
    this.error.set(null);

    this.http.get<Todo[]>(this.apiUrl).subscribe({
      next: (data) => this.todos.set(data),
      error: () =>
        this.error.set('Impossible de charger les tâches. Vérifiez que le serveur est démarré.'),
    });
  }

  addTodo(text: string) {
    this.error.set(null);

    this.http.post<Todo>(this.apiUrl, { text }).subscribe({
      next: (newTodo) => {
        this.todos.update((current) => [...current, newTodo]);
      },
      error: () => this.error.set('Impossible d’ajouter la tâche.'),
    });
  }

  updateTodo(id: number, changes: Partial<Todo>) {
    this.error.set(null);

    this.http.put<Todo>(`${this.apiUrl}/${id}`, changes).subscribe({
      next: (updatedTodo) => {
        this.todos.update((current) =>
          current.map((todo) => (todo.id === id ? updatedTodo : todo)),
        );
      },
      error: () => this.error.set('Impossible de modifier la tâche.'),
    });
  }

  deleteTodo(id: number) {
    this.error.set(null);

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.todos.update((current) => current.filter((todo) => todo.id !== id));
      },
      error: () => this.error.set('Impossible de supprimer la tâche.'),
    });
  }
}
