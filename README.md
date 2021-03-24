# SERVER CACHAIONLINE

### Windows Server

##### Instalar Aplicaciones

* Libreoffice LibreOffice_7.1.0_Win_x64.msi
* ImageMagick ImageMagick-7.0.11-1-Q16-x64-dll.exe
* Ghostscript gs9533w64

##### Configuraciones  

###### Dependencia libreoffice-convert

Es necesario implementar la siguiente configuración en el archivo index.js de la dependencia libreoffice-convert.
* **node_modules/libreoffice-conver/index.js**

**Linea**
```
let command = `-env:UserInstallation=file://${installDir.name} --headless --convert-to ${format}`;
```
**Reemplzar con**
```
let command = `${results.soffice}  --headless --convert-to ${format}`;
```

###### Apache2.4 conexión Websockets.

Modificar archivo httpd.conf
**Habilitar módulo**
````
LoadModule proxy_wstunnel_module modules/mod_proxy_wstunnel.so
````

Agregar ProxyPass y ProxyReverse ejemplo:
````
ProxyPass /socket.io/ ws://localhost:3008/socket.io/
ProxyPassReverse /socket.io/ ws://localhost:3008/socket.io/
````

Configuración con un path definido:
````
ProxyPass /socket-cachaionline/ ws://localhost:3008/socket.io/
ProxyPassReverse /socket-cachaionline/ ws://localhost:3008/socket.io/
````

###### Variables de entorno.

* **DB_URI=** Dirección de conexión a la base de datos MySQL ejemplo: mysql://user:password@ip:port/db_name
* **DB_FORCE=** Valor que indica si la base de datos se elimina y se vuelve a crear. Valores 
* **PORT=** Puerto de escucha del servidor express y socket.io
* **SECRETA=** Llave secreta del Token
* **PATH_STATIC=** Ruta de archivos estáticos ejemplo: E:\\cachaionline\\static\\