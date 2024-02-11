function getBirtdate(){
    const targetDate = new Date('2003-01-05');
    const currentDate = new Date();

    let ageInMillis = currentDate - targetDate;

    let ageInYears = Math.floor(ageInMillis / (1000 * 60 * 60 * 24 * 365));
    ageInMillis -= ageInYears * 1000 * 60 * 60 * 24 * 365;

    let ageInMonths = Math.floor(ageInMillis / (1000 * 60 * 60 * 24 * 30.4375));
    ageInMillis -= ageInMonths * 1000 * 60 * 60 * 24 * 30.4375;

    let ageInDays = Math.floor(ageInMillis / (1000 * 60 * 60 * 24));
    ageInMillis -= ageInDays * 1000 * 60 * 60 * 24;

    let ageInHours = Math.floor(ageInMillis / (1000 * 60 * 60));
    ageInMillis -= ageInHours * 1000 * 60 * 60;

    let ageInMinutes = Math.floor(ageInMillis / (1000 * 60));
    ageInMillis -= ageInMinutes * 1000 * 60;

    let ageInSeconds = Math.floor(ageInMillis / 1000);

    let age = `${ageInYears} Years, ${ageInMonths} months ${ageInDays} days ${ageInHours} hours ${ageInMinutes} minutes ${ageInSeconds} seconds old`;

    const ageDOM = document.getElementById("age")
    ageDOM.textContent = age;
    
    return 1;
}

document.addEventListener("DOMContentLoaded", function() {
    getBirtdate()
    setInterval(getBirtdate, 1000);

});