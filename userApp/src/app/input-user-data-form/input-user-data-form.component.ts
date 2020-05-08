import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormArray, FormGroup, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-input-user-data-form',
  templateUrl: './input-user-data-form.component.html',
  styleUrls: ['./input-user-data-form.component.css']
})
export class InputUserDataFormComponent implements OnInit {
userForm: FormGroup;
submitted: boolean;
registered: boolean;
guid: any;
serviceErrors: any = {};
  constructor( private formBuild: FormBuilder, private http: HttpClient, private router: Router) {
    this.http.get('/api/v1/generate_uid').subscribe((data) => {
      console.log(data);
      // this.guid = data.uid;
    }, error => {
      console.log('There was an error generating the proper GUID on the server', error);
    }
    );
   }

  ngOnInit() {
    this.userForm = this.formBuild.group({
      first_name: ['', [Validators.required, Validators.pattern('^[A-Za-z\-\’]')]],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      zipcode: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]]
    });
  }
  invalidFirstName() {
    return (this.submitted && this.userForm.controls.first_name.errors !== null );
  }
  invalidLastName() {
    return (this.submitted && this.userForm.controls.last_name.errors !== null );
  }
  invalidEmail() {
    return (this.submitted && this.userForm.controls.email.errors !== null );
  }
  invalidZipcode() {
    return (this.submitted && this.userForm.controls.zipcode.errors !== null );
  }
  invalidPassword() {
    return (this.submitted && this.userForm.controls.password.errors !== null);
  }
  onSubmit() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return;
    } else {
      const data: any = Object.assign({guid: this.guid}, this.userForm.value);
      this.http.post('/api/v1/customer', data).subscribe((val: any) => {
        const path = '/user/' + val.customer.uid;
        this.router.navigate([path]);
      },
      error => {
        this.serviceErrors = error.error.error;
      });
      this.registered = true;
    }
  }

}
