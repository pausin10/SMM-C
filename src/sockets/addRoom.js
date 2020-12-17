document.getElementById('pwdPrivate').style.display = 'none';
document.getElementById('pwdInput').style.display = 'none';

function mostrar(dato){
    if(dato=='public'){
        document.getElementById('pwdPrivate').style.display = 'none';
        document.getElementById('pwdInput').style.display= 'none';
    }
    if(dato=='private'){
        document.getElementById('pwdPrivate').style.display = 'block';
        document.getElementById('pwdInput').style.display = 'block';
    }
}