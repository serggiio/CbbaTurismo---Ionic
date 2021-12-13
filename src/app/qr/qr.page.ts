import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.page.html',
  styleUrls: ['./qr.page.scss'],
})
export class QrPage implements OnInit {

  constructor(private qrScanner: QRScanner, public toastController: ToastController, private router: Router) { }

  ngOnInit() {
    this.scan();
  }

  async ionViewWillLeave() {
    await this.qrScanner.destroy();
  }

  scan(){
      // Optionally request the permission early
      this.qrScanner.prepare()
      .then(async (status: QRScannerStatus) => {
        if (status.authorized) {
          this.qrScanner.show();
          //window.document.body.style.backgroundColor = 'transparent';
          //document.getElementsByTagName('body')[0].style.opacity='0';
          this.qrScanner.scan().subscribe(async (val) => {
            try {
              console.log('VALL', val);
              const jsonObj = JSON.parse(val);

              if(!jsonObj.id){
                await this.presentToast('Ocurrio un error, vuelve a intentarlo');
                this.router.navigate(['/home']);
              }
              await this.qrScanner.destroy();
              this.router.navigate(['detail/'+parseInt(jsonObj.id, 10)]);
            } catch (error) {
              await this.presentToast('Ocurrio un error, vuelve a intentarlo');
              this.router.navigate(['/home']);
            }
            //document.getElementsByTagName('body')[0].style.opacity='1';
          });
        } else if (status.denied) {
          console.log('DENEGADO');
          await this.invalidScanner();
        } else {
          console.log('algomas');
          await this.invalidScanner();
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  async invalidScanner(){
    await this.presentToast('Activa el permiso de camara para continuar');
    this.router.navigate(['/home']);
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

}
