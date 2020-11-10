import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import {MatSliderModule, MatCheckboxModule} from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';

/* Form and Validators imports*/
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback } from '../shared/feedback';

/* Observable Params */
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations:[
    trigger('visibility',[
      state('shown', style({
        transform: 'scale(1)',
        opacity: 1
      })),
      state('hidden', style({
        transform: 'scale(0.5)',
        opacity: 0
      })),
      transition('* => *',animate('0.5s ease-in-out'))
    ])
  ]
})


export class DishdetailComponent implements OnInit {

  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  errMess: string;
  dishcopy: Dish;
  visibility='shown';

  /* Form Variables */ 
  commentForm: FormGroup;
  feedback: Feedback;
 

   /* Enable us to get access to the template form and reset it */ 
   @ViewChild('fform') commentFormDirective: { resetForm: (arg0: { rating: number; }) => void; };

  /* JavaScript Object for Validation Messages */
  formErrors = {
    'author' : '',
    'comment': ''
  };

  /* Validation Messages */
  validationMessages = {
    'author': {
      'required': 'Author is required.',
      'minlength': 'Author must be at least 2 characters long',
      'maxlength': 'Author cannot be more than 25 characters'
    },
    'comment': {
      'required': 'comment is required.'
    }
  };



  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location,
    @Inject('BaseURL') private BaseURL) { 
      this.createForm();
    }

    createForm() {
      this.commentForm = this.fb.group({
        author: ['', [Validators.required, Validators.minLength(2), Validators.max(25)]],
        comment: ['', Validators.required],
        rating: 5
      });
  
      this.commentForm.valueChanges
        .subscribe(data => this.onValueChanged(data));
  
      this.onValueChanged(); //reset fomr validation messages
    }



    onValueChanged(data?: any){
      if(!this.commentForm) {
        return;
      }
      const form = this.commentForm;
      for(const field in this.formErrors){
        if(this.formErrors.hasOwnProperty(field)){
          // clear previous error messages (if any)
          this.formErrors[field] = '';
          const control = form.get(field);
          if(control && control.dirty && !control.valid){
            const messages = this.validationMessages[field];
            for(const key in control.errors){
              if(control.errors.hasOwnProperty(key)){
                this.formErrors[field] += messages[key] + ' ';
              }
            }
          }
        }
      }
    }


    onSubmit() {
      let date = new Date;
      
      this.commentForm.value.date = date.toISOString();
      ///this.dish.comments.push(this.commentForm.value);
      this.dishcopy.comments.push(this.commentForm.value);
      this.dishService.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
      errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
      this.commentForm.reset({
        author: '',
        comment: '',
        rating: 5
      });
      this.commentFormDirective.resetForm({rating: 5});
    }



  ngOnInit() { 
       this.dishService.getDishIds()
      .subscribe((dishIds) => this.dishIds = dishIds);
      this.route.params
     .pipe(switchMap((params: Params) => {
       this.visibility = 'hidden'; return this.dishService.getDish(params['id']);}))
     .subscribe(dish => { this.dish = dish;this.dishcopy=dish; this.setPrevNext(dish.id);this.visibility = 'shown'; },
      errmess => this.errMess = <any>errmess);
     ///this.route.params.
    /// pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(params['id']); }))
    ///.subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
     /// errmess => this.errMess = <any>errmess);

  }

  /* Method to Navigate around our dishes */ 
  setPrevNext(dishId: string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void{
    this.location.back();
  }

}
