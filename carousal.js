class Carousal {
  constructor(userOption) {
    this.option = {
      time: 3000
    };
    this.init(userOption);
  }
  init(userOption) {
    Object.assign(this.option, userOption);
    console.log(this.option);
  }
}

export default Carousal;
