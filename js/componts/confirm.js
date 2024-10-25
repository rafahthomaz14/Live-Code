class ConfirmClass {
    constructor(){
        this.mesage = '';
        this.res = false;
    }

    confirmBox(mesage){
        this.res = confirm(`${mesage}`);
        return this.res;
    }
}