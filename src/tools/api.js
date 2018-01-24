const serverUrl = 'http://localhost:8080/';

export default {
   loginUrl: serverUrl + 'user/login',
   userInfoUrl: serverUrl + 'user/info',
   userDeleteUrl: serverUrl + 'user/delete',
   userAllUrl: serverUrl + "user/findAll",
   roleAllUrl: serverUrl + "role/findAll",
   permissionAllUrl: serverUrl + "permission/findAll",
   permissionSaveUrl: serverUrl + "permission/save",
   validatorUsername: serverUrl + "user/validatorUsername",
   userSaveUrl: serverUrl + "user/save",
   roleSaveUrl: serverUrl + "role/save",
   showMenu: serverUrl + "user/findMenu"
}
