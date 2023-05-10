import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NoteDataComponent } from '../note-data/note-data.component';
import { NoteService } from 'src/app/core/services/note.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private _MatDialog: MatDialog,
    private _NoteService: NoteService,
    private _authServices: AuthService
  ) {}

  value = '';

  notes: any[] = [];

  ngOnInit(): void {
    this.getNotes();
  }

  addNote(): void {
    const matDialogRef = this._MatDialog.open(NoteDataComponent);

    matDialogRef.afterClosed().subscribe({
      next: (response) => {
        if (response === 'add') {
          this.getNotes();
        }
      },
    });
  }

  setData(note: any): void {
    const matDiloagRef = this._MatDialog.open(NoteDataComponent, {
      data: { note },
    });

    matDiloagRef.afterClosed().subscribe({
      next: (response) => {
        if (response === 'updated') {
          this.getNotes();
        }
      },
    });
  }

  getNotes(): void {
    const model = {
      token: localStorage.getItem('_noteotken'),
      userID: this._authServices.user.getValue()._id,
    };

    console.log(model);

    this._NoteService.getNotes(model).subscribe({
      next: (response) => {
        if (response.message === 'success') {
          this.notes = response.Notes;
        }
        console.log(response);
      },
    });
  }

  deleteNote(id: string, index: number): void {
    const model = {
      NoteID: id,
      token: localStorage.getItem('_noteotken'),
    };

    this._NoteService.deleteNote(model).subscribe({
      next: (response) => {
        if (response.message === 'deleted') {
          this.notes.splice(index, 1);

          this.notes = [...this.notes];
        }
      },
    });
  }
}
