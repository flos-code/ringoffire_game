import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimations(), provideAnimations(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-e29fa","appId":"1:986980683534:web:9bd9d5f1a76f28b115115f","storageBucket":"ring-of-fire-e29fa.appspot.com","apiKey":"AIzaSyAla-FF074JRI_lF0H-U5_QXeUCYpHGbKg","authDomain":"ring-of-fire-e29fa.firebaseapp.com","messagingSenderId":"986980683534"}))), importProvidersFrom(provideFirestore(() => getFirestore())), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-e29fa","appId":"1:986980683534:web:cdf9b7d383996a7015115f","storageBucket":"ring-of-fire-e29fa.appspot.com","apiKey":"AIzaSyAla-FF074JRI_lF0H-U5_QXeUCYpHGbKg","authDomain":"ring-of-fire-e29fa.firebaseapp.com","messagingSenderId":"986980683534"}))), importProvidersFrom(provideFirestore(() => getFirestore())), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-new-5b87b","appId":"1:657512684847:web:c0e10f9cc312c2e3afd5da","storageBucket":"ring-of-fire-new-5b87b.appspot.com","apiKey":"AIzaSyChOTBhm4MEo5Ol9Myfo07jedFcKMMCZdQ","authDomain":"ring-of-fire-new-5b87b.firebaseapp.com","messagingSenderId":"657512684847"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
