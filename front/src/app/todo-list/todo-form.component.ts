import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="add-todo">
      <input
        type="text"
        [(ngModel)]="todoText"
        (keydown.enter)="add()"
        placeholder="Nouvelle tâche..."
      />

      <button (click)="add()" [disabled]="!todoText.trim()">Ajouter</button>
    </div>
  `,

    styles: [
      `
    .add-todo {
      display: flex;
      gap: 10px;
      margin: 22px 0;
      padding: 6px;
      background: #f3f8f8;
      border: 1px solid #dceaea;
      border-radius: 12px;
      transition: 0.2s;
    }

    .add-todo:focus-within {
      border-color: #278f91;
      box-shadow: 0 0 0 3px rgba(39, 143, 145, 0.10);
      background: white;
    }

    input {
      flex: 1;
      min-width: 0;
      padding: 11px 12px;
      border: none;
      background: transparent;
      outline: none;
      font-size: 14px;
      color: #344f54;
    }

    input::placeholder {
      color: #9aabad;
    }

    button {
      padding: 10px 17px;
      background: #278f91;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      transition: 0.2s;
    }

    button:hover:not(:disabled) {
      background: #207779;
      transform: translateY(-1px);
    }

    button:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  `,
  ],
})
export class TodoFormComponent {
  todoAdded = output<string>();

  todoText = '';

  add() {
    const text = this.todoText.trim();

    if (!text) return;

    this.todoAdded.emit(text);
    this.todoText = '';
  }
}
