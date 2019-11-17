import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  projectForm: FormGroup;
  public emailExist: boolean = false;
  public statusControl: Array<string> = ['Stable','Critical','Finished'];
  private emailsControl: Array<string> = ['jean@gmail.com','paul@yahoo.fr','luffy@onepiece.net'];

  constructor(private formBuilder: FormBuilder) { }
  
  ngOnInit(): void {
    this.InitForm(); // or this.InitFormWithFormBuilder();
    this.statusChanged();
  }

  private InitForm(): void {
    this.projectForm = new FormGroup({
      'userData': new FormGroup({
        'firstName': new FormControl(null,[Validators.required]),
        'lastName': new FormControl(null,[Validators.required]),
        'email': new FormControl(null,[Validators.required,Validators.email],[this.checkEmailExist])
      }),
      'project': new FormGroup({
        'projectName': new FormControl(null,[Validators.required]),
        'status': new FormControl('Stable',[Validators.required,this.checkStatusValues]),
        'partners': new FormArray([])
      })
    })
  }

  private InitFormWithFormBuilder(): void {
    this.projectForm = this.formBuilder.group({
      'userData': this.formBuilder.group({
        'firstName': [null, [Validators.required]],
        'lastName': [null, [Validators.required]],
        'email': [null, [Validators.required, Validators.email,], [this.checkEmailExist]]
      }),
      'project': this.formBuilder.group({
        'projectName': [null, [Validators.required]],
        'status': ['Stable', [Validators.required,this.checkStatusValues]],
        'partners': this.formBuilder.array([])
      })
    })
  }

  private checkStatusValues = (control: FormControl): {[s: string]: boolean} => {
    return this.statusControl.indexOf(control.value) === -1 ? {'isWrongStatus': true} : null
  }

  /**
   * Validators async custom for check if email exist in emailsControl's arrayList
   */
  private checkEmailExist = (control: FormControl): Promise<any> | Observable<any> => {
    return new Promise((resolve,reject) => {
      setTimeout(
        () => {
          if(this.emailsControl.indexOf(control.value) !== -1) {
            resolve({'emailExist': true});
            this.emailExist = true;
          }else {
            resolve(null);
            this.emailExist = false;
          } 
        } 
      ,3500)
    })
  }

  private statusChanged(): void {
    this.projectForm.get('project.status').valueChanges.subscribe(
      value => console.log(value)
    )
  }

  public createPartnerControls(): void {
    const control = new FormControl(null, [Validators.required]);
    (<FormArray>this.projectForm.get('project.partners')).push(control);
  }

  public deletePartnerContols(index: number): void {
    (<FormArray>this.projectForm.get('project.partners')).removeAt(index);
  }

  /**
   * return controls, it's necessary for the prod
   */
  get partnersControls() {
    return (<FormArray>this.projectForm.get('project.partners'));
  }

  public onSubmit(): void {
    console.log(this.projectForm);
  }
}
