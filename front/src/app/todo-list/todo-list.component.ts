
import { Component, inject, computed, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TodoService } from '../services/todo.service';
import { Todo } from '../models/todo.model';
import { TodoFormComponent } from './todo-form.component';
import { EditableDirective } from '../directives/editable.directive';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [RouterLink, EditableDirective, TodoFormComponent],
  template: `
    <div class="todo-container">
      <h2>Ma ToDo List</h2>

      @if (todoService.error()) {
        <div class="error-message">
          {{ todoService.error() }}
        </div>
      }

      <!-- Formulaire d'ajout -->
      <app-todo-form (todoAdded)="add($event)" />

      <!-- Filtres avec compteurs -->
      <div class="filters">
        <a routerLink="/all" [class.active]="filter() === 'all'">
          Toutes <span>{{ allCount() }}</span>
        </a>

        <a routerLink="/in-progress" [class.active]="filter() === 'in-progress'">
          En cours <span>{{ inProgressCount() }}</span>
        </a>

        <a routerLink="/done" [class.active]="filter() === 'done'">
          Terminées <span>{{ doneCount() }}</span>
        </a>
      </div>

      <!-- Barre de progression -->
      <div class="progress-section">
        <div class="progress-info">
          <span>Progression</span>
          <span>{{ completedCount() }} / {{ allCount() }} terminées</span>
        </div>

        <div class="progress-bar">
          <div
            class="progress-fill"
            [style.width.%]="progress()">
          </div>
        </div>
      </div>

      <!-- Liste des tâches -->
      <ul>
        @for (todo of filteredTodos(); track todo.id) {
          <li>
            <input
              type="checkbox"
              [checked]="todo.status === 'done'"
              (change)="toggleStatus(todo)"
            />

            <div
              class="todo-text"
              [class.done]="todo.status === 'done'"
              appEditable
              (editComplete)="updateText(todo.id, $event)"
              title="Double-cliquez pour éditer"
            >
              {{ todo.text }}
            </div>

            <button
              (click)="delete(todo.id)"
              class="btn-delete"
              title="Supprimer">
              ✖
            </button>
          </li>
        } @empty {
          <div class="empty-state">
            <p>Aucune tâche dans cette catégorie.</p>
          </div>
        }
      </ul>
    </div>
  `,
  styles: [
    `
      .todo-container {
        max-width: 400px;
        margin: 2rem auto;
        padding: 24px;
        font-family: sans-serif;
        background: #ffffff;
        border-radius: 14px;
        box-shadow: 0 4px 18px rgba(0, 70, 80, 0.08);
      }

      h2 {
        color: #24545c;
      }

      /* Filtres */
      .filters {
        display: flex;
        gap: 8px;
        margin: 20px 0;
      }

      .filters a {
        text-decoration: none;
        padding: 7px 10px;
        background: #edf5f5;
        border-radius: 8px;
        color: #45666b;
        font-size: 12px;
        transition: 0.2s;
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .filters a:hover {
        background: #d8ebeb;
      }

      .filters a.active {
        background: #278f91;
        color: white;
      }

      .filters span {
        font-weight: bold;
      }

      /* Progression */
      .progress-section {
        margin: 20px 0;
      }

      .progress-info {
        display: flex;
        justify-content: space-between;
        color: #45666b;
        font-size: 13px;
        margin-bottom: 8px;
      }

      .progress-bar {
        height: 8px;
        background: #edf5f5;
        border-radius: 20px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background: #278f91;
        border-radius: 20px;
        transition: width 0.3s ease;
      }

      /* Liste */
      ul {
        list-style: none;
        padding: 0;
      }

      li {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 11px 8px;
        border-bottom: 1px solid #edf1f2;
        border-radius: 6px;
        transition: background 0.2s, transform 0.2s;
        animation: fadeIn 0.25s ease;
      }

      li:hover {
        background: #f0f8f8;
        transform: translateX(3px);
      }

      .todo-text {
        flex-grow: 1;
        cursor: pointer;
        color: #344f54;
        overflow-wrap: anywhere;
      }

      .todo-text.done {
        text-decoration: line-through;
        color: #9aabad;
      }

      /* Cases à cocher */
      li input[type="checkbox"] {
        appearance: none;
        width: 19px;
        height: 19px;
        border: 2px solid #b8cece;
        border-radius: 6px;
        cursor: pointer;
        transition: 0.2s;
        position: relative;
        flex-shrink: 0;
      }

      li input[type="checkbox"]:checked {
        background: #278f91;
        border-color: #278f91;
      }

      li input[type="checkbox"]:checked::after {
        content: '✓';
        color: white;
        position: absolute;
        left: 3px;
        top: -1px;
        font-size: 13px;
      }

      /* Suppression */
      .btn-delete {
        background: #fff0f0;
        color: #d65c67;
        border: none;
        border-radius: 7px;
        padding: 5px 9px;
        cursor: pointer;
        transition: 0.2s;
      }

      .btn-delete:hover {
        background: #fbdada;
      }

      /* Messages */
      .empty-state {
        text-align: center;
        padding: 20px;
        color: #8ba2a5;
        font-size: 14px;
      }

      .error-message {
        background: #fff0f0;
        color: #c62828;
        border: 1px solid #efbaba;
        padding: 10px;
        border-radius: 8px;
        margin-bottom: 1rem;
        font-size: 14px;
      }

      /* Animation */
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Responsive */
      @media (max-width: 480px) {
        .todo-container {
          margin: 1rem;
          padding: 18px;
        }

        .filters {
          gap: 5px;
        }

        .filters a {
          padding: 7px;
          font-size: 11px;
        }
      }
    `,
  ],
})
export class TodoListComponent implements OnInit {
  todoService = inject(TodoService);

  filter = input<string>('all');

  // Liste filtrée
  filteredTodos = computed(() => {
    const currentFilter = this.filter();
    const todos = this.todoService.todos();

    if (currentFilter === 'in-progress') {
      return todos.filter(t => t.status === 'in-progress');
    }

    if (currentFilter === 'done') {
      return todos.filter(t => t.status === 'done');
    }

    return todos;
  });

  // Compteurs
  allCount = computed(() => this.todoService.todos().length);

  completedCount = computed(() =>
    this.todoService.todos().filter(t => t.status === 'done').length
  );

  doneCount = computed(() => this.completedCount());

  inProgressCount = computed(() =>
    this.todoService.todos().filter(t => t.status === 'in-progress').length
  );

  // Pourcentage de progression
  progress = computed(() => {
    const total = this.allCount();

    if (total === 0) return 0;

    return (this.completedCount() / total) * 100;
  });

  ngOnInit() {
    this.todoService.loadTodos();
  }

  add(text: string) {
    this.todoService.addTodo(text);
  }

  updateText(id: number, newText: string) {
    if (newText.trim()) {
      this.todoService.updateTodo(id, { text: newText.trim() });
    }
  }

  toggleStatus(todo: Todo) {
    const newStatus = todo.status === 'done' ? 'in-progress' : 'done';
    this.todoService.updateTodo(todo.id, { status: newStatus });
  }

  delete(id: number) {
    this.todoService.deleteTodo(id);
  }
}
