const config = require('./../config/local.json');
window.SADDRESS = global.process.env.SADDRESS || process.env.SADDRESS || config.SADDRESS ||  "localhost";

const updateJson = require('update-json');

var menu = new nw.Menu({ type: 'menubar' });
var submenu = new nw.Menu();
submenu.append(new nw.MenuItem({
  label: 'Direccion IP',
  click: () => {
    let ip = prompt("Direccion IPV4 del pack", config.SADDRESS) || null;
    const test =  /(192)\.(168)(\.([2][0-5][0-5]|[1][0-9][0-9]|[1-9][0-9]|[0-9])){2}/g.exec(ip)
    let isValid = false;
    if(test && typeof ip === 'string' && test[0].length === ip.length) isValid = true;

    if(isValid) {
      updateJson(global.__dirname+"/config/local.json", { "SADDRESS": ip }, function (error) {
        console.log('error', error);
        if (error) {
          alert("Ocurrio un error, por favor intenta otra vez.");
        }
        else {
          alert("OK, reinicia el equipo para que los cambios tengan efecto");
        }
      })
    } else {
      if(ip === null || ip === '') return;
      alert("Escribe un direccion ip clase c valida");
    }
  }
}))

submenu.append(new nw.MenuItem({
  label: 'Resetear',
  click: () => {  
    if (window.confirm(`Esto eliminará toda la configuración de este modulo`)) { 
      localStorage.clear();   
      alert("Ok, reinicia el programa para ver los cambios reflejados.")
    }
  
  
  }
}))

submenu.append(new nw.MenuItem({
  label: 'Cerrar',
  click: () => {
    nw.App.quit();
  }
}))



menu.append(new nw.MenuItem({
  label: 'Archivo',
  submenu: submenu
}));

nw.Window.get().menu = menu;
