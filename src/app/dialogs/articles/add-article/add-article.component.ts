import { Component, OnInit, Inject, OnDestroy, AfterViewInit, EventEmitter, Input, Output } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { NgForm } from '@angular/forms'

import { ArticleRequestService }  from '../../../request-services/article-request.service'

import { ImageSelectComponent } from '../../albums/image-select/image-select.component'

declare var swal: any

declare var tinymce: any

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.sass']
})
export class AddArticleComponent implements OnInit, AfterViewInit, OnDestroy {

  properties: any;

  published: boolean = false

  categories: Array<any> = [];

  add_categories: any

  image_name: string

  @Input() elementId: string = "tinymce-textarea";

  @Output() onEditorKeyup = new EventEmitter<any>();

  editor: any

  constructor(
    public dialogRef: MdDialogRef<AddArticleComponent>,
    @Inject(MD_DIALOG_DATA) private data: any,
    private article: ArticleRequestService,
    public dialog: MdDialog,
  )
  {
    this.properties = data.properties

    this.add_categories = data.properties.categories
  }


  ngOnInit()  {
  }

  ngAfterViewInit() {
    tinymce.init({
      selector: '#' + this.elementId,
      plugins: ['link', 'paste', 'table'],
      skin_url: '/assets/skins/lightgray',
      setup: editor => {

        this.editor = editor;

        editor.on('keyup', () => {

          const content = editor.getContent();
          this.onEditorKeyup.emit(content);
        });
      },
    });
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }

  addArticle(f: NgForm)
  {
    let categories = []

    for(let one of this.categories)
      categories.push(one.id)

    this.article.postArticle({
      title: f.value.title,
      sub_title: f.value.sub_title,
      body: tinymce.activeEditor.getContent(),
      keywords: f.value.keywords,
      published: f.value.published ? 1 : 0,
      language: f.value.language,
      slug: f.value.slug,
      category: categories,
      image: this.image_name
    }).subscribe(response => {

      this.dialogRef.close(response.message);

      //swal(response.header, response.message, response.state)
    })
  }

  addCategory(item: any)
  {
    if(item.selected.value == undefined || item.selected.value == null) return;

    let index = this.add_categories.findIndex( obj => obj.id === item.selected.value)

    this.categories.push(this.add_categories[index])

    this.add_categories.splice(index, 1)
  }

  deleteCategory(item: any)
  {
    this.add_categories.push(this.categories[item])
    this.categories.splice(item, 1)
  }

  /*  showImage(img: string){
    var reader = new FileReader();
    let input = this.inputEl.nativeElement

    reader.onload = function(e: any){
      let test = document.getElementById(img)
      test.setAttribute('src', e.target.result)
    }

    reader.readAsDataURL(input.files.item(0));
  }
  */
  openImageSelect()
  {
    let dialogRef = this.dialog.open(ImageSelectComponent, {

    })

    dialogRef.afterClosed().subscribe( response => {

      let test = document.getElementById('img')

      test.setAttribute('src', response.url)

      this.image_name = response.u_id
    })
  }

}
