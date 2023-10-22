class SerialNumberGenerator {
  constructor() {
    this.counter = 1;
  }

  generateUniqueCode() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const min = String(currentDate.getMinutes()).padStart(3, "0");
    const mili = String(currentDate.getMilliseconds()).padStart(4, "0");
    const serialNumber = `${year}${month}${day}${min}${mili}${this.counter}`;
    this.counter++;
    return serialNumber;
  }
}

module.exports = SerialNumberGenerator;
