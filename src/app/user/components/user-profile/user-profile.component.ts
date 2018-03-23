import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms'

import { Subscription } from 'rxjs/Subscription'

import { CacheService } from '../../imports';
import { UserRequestService } from '../../services/user-request.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.sass']
})
export class UserProfileComponent implements OnInit {

  user: any

  subs = new Subscription()

  languages: any

  edit_bio: boolean = false

  AUTHOR_IMAGE_URL: string

  @ViewChild('file') file: ElementRef

  get isPageReady()
  {
    return this.user;
  }

  constructor(
    private userRequestService: UserRequestService,
    private cacheService: CacheService
  )
  {
    this.AUTHOR_IMAGE_URL = this.userRequestService.makeUrl('public.image.author');
  }

  ngOnInit() {
    let rq2 = this.cacheService.get('languages', this.userRequestService.makeGetRequest('admin.languages'))
                                .subscribe( response => this.languages = response )

    let rq1 = this.userRequestService.getUserProfile().subscribe( response => this.user = response );

    this.subs.add(rq1)
  }

  ngOnDestroy()
  {
    this.subs.unsubscribe()
  }

  showImage(img: string)
  {
    var reader = new FileReader();

    let input = this.file.nativeElement

    let item = document.getElementById(img)

    reader.onload = (e: any) => {

      let rq3 = this.userRequestService.postUserProfileImage(this.file.nativeElement.files.item(0)).subscribe( response => {

        item.setAttribute('src', e.target.result)
      })

      this.subs.add(rq3)
    }

    reader.readAsDataURL(input.files.item(0));
  }

  updateProfile(f: NgForm)
  {
    let rq2 = this.userRequestService.postUserProfile({name: f.value.name, biography: this.user.user_data.biography}).subscribe( response => {
                this.user = null

                this.edit_bio = false

                let rq1 = this.userRequestService.getUserProfile().subscribe( response => this.user = response)

                this.subs.add(rq1)
              })

    this.subs.add(rq2)
  }

  updateProfileImage()
  {
    let rq3 = this.userRequestService.postUserProfileImage(this.file.nativeElement.files.item(0)).subscribe( response => {

    })
  }

}
