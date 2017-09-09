import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms'
import { MdDialogRef } from '@angular/material';

import { HttpEventType, HttpResponse, HttpRequest }  from '@angular/common/http'

import { ImageRequestService }  from "../../../request-services/image-request.service"

declare var swal: any

@Component({
  selector: 'app-image-add',
  templateUrl: './image-add.component.html',
  styleUrls: ['./image-add.component.sass']
})
export class ImageAddComponent implements OnInit {

  constructor(
    private imageRequest: ImageRequestService,
    public dialogRef: MdDialogRef<ImageAddComponent>,
  ){ }

  length: number = 0

  uploading: boolean = false

  @ViewChild('file') file: ElementRef

  ngOnInit() {
  }

  ngAfterViewInit()
  {
    this.file.nativeElement.click()
  }

  showImage(img: string)
  {
    var reader = new FileReader();
    let input = this.file.nativeElement

    let item = document.getElementById(img)

    item.setAttribute('src', '')

    reader.onload = function(e: any){

      item.setAttribute('src', e.target.result)
    }

    reader.readAsDataURL(input.files.item(0));
  }

  uploadImage(f: NgForm)
  {
    let image_public = (f.value.public) ? 1 : 0;

    this.imageRequest.postImage({name: f.value.name, public: image_public, alt: f.value.alt}, this.file.nativeElement.files.item(0)).subscribe(response => {

      this.uploading = true

      if (response.type === HttpEventType.UploadProgress) {
        // This is an upload progress response. Compute and show the % done:
        const percentDone = Math.round(100 * response.loaded / response.total);
        console.log(`File is ${percentDone}% uploaded.`);
        this.length = percentDone
      } else if (response instanceof HttpResponse) {
        console.log('File is completely uploaded!');

        this.dialogRef.close(true);

        this.showSwal(response)

      }

    })
  }


  showSwal(data)
  {
    swal(data.header, data.message, data.state)
  }

}