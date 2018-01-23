const config = window.localStorage;
window.SADDRESS = global.process.env.SADDRESS || process.env.SADDRESS || config.SADDRESS || "localhost";

var menu = new nw.Menu({ type: 'menubar' });
var submenu = new nw.Menu();
submenu.append(new nw.MenuItem({
  label: 'Direccion IP',
  click: () => {
    window.changeIpPopUp.modal.openPopUp();
  }
}))

submenu.append(new nw.MenuItem({
  label: 'Borrar cache',
  click: () => {
    window.deleteCachePopUp.modal.openPopUp();
    /*
    if (window.confirm(`Esto eliminará toda la configuración de este modulo`)) {
      localStorage.clear();
      alert("Ok, reinicia el programa para ver los cambios reflejados.")
    }
    */
  }
}))

submenu.append(new nw.MenuItem({
  label: 'Establecer Identificador',
  click: () => {
    window.changeIDPopUp.modal.openPopUp();
    /*
    let id = prompt("Identificador: ", config.Modulo);
    if(id) {
      localStorage.setItem("Modulo", id);
      alert("Ok, reinicia el programa para ver los cambios reflejados.")
    }
    */
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
