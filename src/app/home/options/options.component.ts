import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import QrcodeDecoder from 'qrcode-decoder';
import { Capacitor } from '@capacitor/core';
import { File } from '@ionic-native/file/ngx';
declare global {
  interface Window {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      FB: any;
  }
}


@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit {

  // eslint-disable-next-line max-len
  base64Qr = '';//'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAK6SURBVO3BQW7sWAwEwSxC979yjpdcPUCQur/NYUT8wRqjWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoFw8l4ZtUuiR0Kl0STlROkvBNKk8Ua5RijVKsUS5epvKmJNyRhE9SeVMS3lSsUYo1SrFGufiwJNyhcodKl4ROpUvCm5Jwh8onFWuUYo1SrFEu/rgkdConKl0SOpW/rFijFGuUYo1y8cepdEnoVLokdCqTFGuUYo1SrFEuPkzlm1TuSEKncofKb1KsUYo1SrFGuXhZEr4pCZ1Kl4ROpUvCHUn4zYo1SrFGKdYoFw+p/CZJ6FS6JNyh8pcUa5RijVKsUS4eSkKn0iXhRKVLwh0qJ0l4IgmdykkSOpUuCScqTxRrlGKNUqxRLh5SeZPKHUnoVN6kcpKETqVLQqfSJeFNxRqlWKMUa5SLh5LwRBKeUOmS0Kl0SehUuiScqHQqXRL+pWKNUqxRijXKxYepfFISTpLwhMoTKt9UrFGKNUqxRrl4SKVLwkkSOpUuCScqd6icJOEkCScqncq/VKxRijVKsUaJP/jDktCpnCShUzlJQqfSJeEJlTcVa5RijVKsUS4eSsI3qdyRhJMknKg8ofJNxRqlWKMUa5SLl6m8KQlvUnkiCXck4Q6VJ4o1SrFGKdYoFx+WhDtU7lDpknBHEjqVE5UuCXeofFKxRinWKMUa5eKPS8ITKl0SOpUuCZ1Kl4ROpUtCp/KmYo1SrFGKNcrF/1wSOpUuCXeodEnoVD6pWKMUa5RijXLxYSqfpNIloVM5UemScKLSJeFE5SQJncoTxRqlWKMUa5SLlyXhm5JwkoQ7VLok3KHSJaFT6VTeVKxRijVKsUaJP1hjFGuUYo1SrFGKNUqxRinWKMUapVijFGuUYo1SrFGKNUqxRinWKMUa5T/CWQv8e0y9agAAAABJRU5ErkJggg==';
  options: CameraOptions;

  constructor(private modalController: ModalController, private camera: Camera, private file: File) { }

  async ngOnInit() {
    this.options = {
      /*destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY*/

      /*sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      quality: 100,
      allowEdit: true,
      saveToPhotoAlbum: true,
      correctOrientation: true,
      encodingType: this.camera.EncodingType.JPEG,
      destinationType: this.camera.DestinationType.FILE_URI*/

      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY

    };

    //const qr = new QrcodeDecoder();
    /*const img1 = document.querySelector('#img1');
    qr.decodeFromImage(img1).then((res) => {
      console.log(res);
    });*/
    //const code = await qr.decodeFromImage('../../../assets/turismoqr.png');
    //console.log(code);
  }
  dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

  /*async resolveFile() {
    return this.file.createFile()
  }*/

  async selectImage(){
    await this.camera.getPicture(this.options).then(async (imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.base64Qr = 'data:image/jpeg;base64,' + imageData;
      console.log(imageData);

    console.log('Decoder try');
    const qr = new QrcodeDecoder();
    await qr.decodeFromImage(
      this.base64Qr).then((res) => {
        console.log('DECODED1');
        console.log(res);
    }).catch((err) => {
      console.log('Error');
      console.log(err);
    });

    // eslint-disable-next-line max-len
    await qr.decodeFromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAK/SURBVO3BQW7sWAwEwSxC979yjpdcPUCQur/NYUT8wRqjWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoFw8l4ZtUuiR0KidJ6FROkvBNKk8Ua5RijVKsUS5epvKmJJyo3KHSJaFTOVF5UxLeVKxRijVKsUa5+LAk3KFyRxI6lZMkvCkJd6h8UrFGKdYoxRrl4o9T6ZLQqXQqXRImKdYoxRqlWKNcDKPyf1asUYo1SrFGufgwlU9KQqdyh8oTKr9JsUYp1ijFGuXiZUn4TZLQqXRJ6FROkvCbFWuUYo1SrFHiDwZLwonKJMUapVijFGuUi4eS0Kl0SehU7kjCiUqXhE6lS0KXhE7lJAmdykkSOpUuCZ3KE8UapVijFGuUiy9LQqdyotIl4QmVkyTckYROpVP5pmKNUqxRijXKxZepdEnoVLokdCqfpNIloVPpktAloVPpkvBJxRqlWKMUa5SLh1S6JJwkoVPpktCpnCShU7kjCZ1Kp3Ki0iXhXyrWKMUapVijXDyUhE7lCZUuCZ3KSRI6lROVLgl3qDyh8qZijVKsUYo1SvzBH5aEJ1S6JDyh0iXhDpUnijVKsUYp1igXDyXhm1TuUOmS0CXhRKVLwhMqXRLeVKxRijVKsUa5eJnKm5JwotIl4Q6VLgldEjqVLgldEjqVE5U3FWuUYo1SrFEuPiwJd6g8odIl4SQJdyShU+mScJKETuVNxRqlWKMUa5SLYZLQqbwpCV0S7lD5pGKNUqxRijXKxR+XhE7lTUl4Igl3qDxRrFGKNUqxRrn4MJVPUnkiCZ1Kp3KShE7lXyrWKMUapVijXLwsCd+UhDtUOpWTJNyRhE7lJAmdyhPFGqVYoxRrlPiDNUaxRinWKMUapVijFGuUYo1SrFGKNUqxRinWKMUapVijFGuUYo1SrFH+AxbLEvvwnRPdAAAAAElFTkSuQmCC').then((res) => {
        console.log('DECODED1 TEST');
        console.log(res);
    }).catch((err) => {
      console.log('Error');
      console.log(err);
    });



      /*const filename = imageData.substring(imageData.lastIndexOf('/')+1);
      const path =  imageData.substring(0,imageData.lastIndexOf('/')+1);
      const imageLoad = Capacitor.convertFileSrc(imageData);
      console.log('START');
      console.log(imageData);
      console.log(imageLoad);
      console.log(filename);
      console.log(path);
      console.log('END');
      const result = await qr.decodeFromImage(
        'http://localhost/_capacitor_file_/data/user/0/io.ionic.starter/cache/IMG_20211019_005201.jpg');
            console.log('INTENTANDOO');
            console.log(result);
            console.log(result.data);*/

      //then use the method reasDataURL  btw. var_picture is ur image variable
         /*this.file.copyFile(path, filename, '../../../assets/', 'turismoqr1.png').then(async res=> {
          console.log('supuesta url');
          console.log(res);
          const result = await qr.decodeFromImage('../../../assets/turismoqr1.png');
            console.log('INTENTANDOO');
            console.log(result);
            console.log(result.data);
         });*/
      //const imageLoad = Capacitor.convertFileSrc(imageData);
      /*console.log('EN THEN1');
      console.log(imageLoad);
      this.base64Qr = imageLoad;*/
      /*
      const code = await qr.decodeFromImage(imageLoad);
      console.log('EN DECODE');
*/
      /*const img1 = document.querySelector('#img1');
      qr.decodeFromImage(img1).then((code) => {
        console.log('INTENTANDO');
        console.log(code);
        console.log(code.data);
      });*/

      //Read qr from assets folder
      //Error: assets folder does not exist in movile
      /*this.writeFile(imageData, 'QrImages', 'tempQr.jpeg');
      const codess = await qr.decodeFromImage('../../../assets/turismoqr.png');
      console.log('Prueba local');
      console.log(codess);
      console.log(codess.data);*/

     }, (err) => {
        console.log('Error papu');
        console.log(err);
     });
  }

  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  savebase64AsImageFile(folderpath,filename,content,contentType){
    // Convert the base64 string in a Blob
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const DataBlob = this.b64toBlob(content,contentType, 512);

  }

  writeFile(base64Data: any, folderName: string, fileName: any) {
    const contentType = base64Data;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const DataBlob = this.b64toBlob(base64Data, contentType, 512);

    const filePath = this.file.externalRootDirectory + folderName;
    this.file.writeFile(filePath, fileName, DataBlob, contentType).then((success) => {
        console.log('File Writed Successfully', success);
    }).catch((err) => {
        console.log('Error Occured While Writing File', err);
    });
  }

}
