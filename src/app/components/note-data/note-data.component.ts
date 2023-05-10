import jwtDecode from 'jwt-decode';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { NoteService } from 'src/app/core/services/note.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-note-data',
  templateUrl: './note-data.component.html',
  styleUrls: ['./note-data.component.scss'],
})
export class NoteDataComponent implements OnInit {
  constructor(
    private _fb: FormBuilder,
    private _NoteService: NoteService,
    private _MatDialogRef: MatDialogRef<NoteDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  dataForm!: FormGroup;
  userData: any;

  ngOnInit(): void {
    this.creatForm();
    this.userData = jwtDecode(localStorage.getItem('_noteotken')!);
    console.log(this.data);
  }

  creatForm(): void {
    this.dataForm = this._fb.group({
      title: [this.data ? this.data.note.title : '', [Validators.required]],
      desc: [this.data ? this.data.note.desc : '', [Validators.required]],
      token: localStorage.getItem('_noteotken'),
    });
  }

  sendData(): void {
    if (this.dataForm.valid) {
      console.log(this.dataForm.value);

      if (this.data === null) {
        this.addNote();
      } else {
        this.updateNote();
      }
    }
  }

  addNote(): void {
    const data = {
      ...this.dataForm.value,
      citizenID: this.userData._id,
    };

    console.log(data);

    this._NoteService.addNote(data).subscribe({
      next: (response: any) => {
        if (response.message === 'success') {
          this._MatDialogRef.close('add');
        }

        console.log(response);
      },
    });
  }

  updateNote(): void {
    const model = {
      ...this.dataForm.value,
      NoteID: this.data.note._id,
      token: localStorage.getItem('_noteotken'),
    };

    this._NoteService.updateNote(model).subscribe({
      next: (response) => {
        console.log(response);

        if (response.message === 'updated') {
          this._MatDialogRef.close('updated');
        }
      },
    });
  }
}
