/*
Inputs:
XPPool
GearXP
DailyXPGain
ACFund
DailyACGain
ctapperfarming
ctappertposing
bombard

Outputs:
Days Required
*/

let CurXPPool = 3000000000000;
let CurGearXP = 300000000;
let CurDailyXP = 300000000000;
let CurTposeCount = 4;
let CurACFund = 400;
let CurACGain = 40;
let CurCTFarming = "ON";
let CurCTTpose = "ON";
let CurBombard = "ON";
let CurXPPoolInput;
let CurGearXPInput;
let CurDailyXPInput;
let CurTposeCountInput;
let CurACFundInput;
let CurACGainInput;
let CurCTFarmingInput;
let CurCTTposeInput;
let CurBombardInput;

let updateButton;
let suggestButton;

let CurCalculate;
let suggest;

let result;
let suggestResult;

let calculated = false;

function setup() {
  noCanvas();
  suggestCalculate();
  createP("Current XP Pool");
  CurXPPoolInput = createInput("3,000,000,000,000");
  createP("Current Gear XP");
  CurGearXPInput = createInput("300,000,000");
  createP("Daily XP Gain");
  CurDailyXPInput = createInput("300,000,000,000");
  createP("Daily Transpose Count");
  CurTposeCountInput = createInput("4");
  createP("Current AC Fund");
  CurACFundInput = createInput("400");
  createP("Daily AC Gain");
  CurACGainInput = createInput("40");
  createP("Crazy Tapper Settings");
  CurCTFarmingInput = createCheckbox("Farming with Crazy Tapper", "ON");
  CurCTFarmingInput.changed(CurCTFarmingInputChanged);
  CurCTTposeInput = createCheckbox("Transposing with Crazy Tapper", "ON");
  CurCTTposeInput.changed(CurCTTposeInputChanged);
  createP("Other Settings");
  CurBombardInput = createCheckbox("Bombard Transposes on last day?", "ON");
  CurBombardInput.changed(CurBombardInputChanged);
  createP("");
  updateButton = createButton("Calculate");
  updateButton.mousePressed(CalculateButton);
  result = createP("")
}

function CalculateButton() {
  CurXPPool = Number(CurXPPoolInput.value().split(',').join(''));
  CurGearXP = Number(CurGearXPInput.value().split(',').join(''));
  CurDailyXP = Number(CurDailyXPInput.value().split(',').join(''));
  CurTposeCount = Number(CurTposeCountInput.value().split(',').join(''));
  CurACFund = Number(CurACFundInput.value().split(',').join(''));
  CurACGain = Number(CurACGainInput.value().split(',').join(''));
  CurCalculate = new Calculate(
    CurTposeCount,
    CurXPPool,
    CurGearXP,
    CurDailyXP,
    CurACFund,
    CurACGain,
    CurCTFarming,
    CurCTTpose,
    CurBombard
  );
  CurCalculate.calc();
  if(CurBombard == "ON" && CurCalculate.BombardTPoses > CurTposeCount){
    result.html(
      "</br>Days Left to Onyx: " + CurCalculate.Days +
      "</br>Total AC Spent(Daily Transposes + Bombard): " +(CurCalculate.TotalAC + CurCalculate.BombardAC) + " (" + CurCalculate.TotalAC + "+" + CurCalculate.BombardAC + ")" +
      "</br>Total Tranpose Count (Daily Transposes + Bombard): " + (CurCalculate.TotalTPoses + CurCalculate.BombardTPoses) + " (" + CurCalculate.TotalTPoses + "+" + CurCalculate.BombardTPoses + ")" +
      "</br>XP Pool by the end: " + CurCalculate.NewXPPool.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 
      "</br>ACs left by the end (Starting Fund + Daily Gains - Spent): " + CurCalculate.ACFund + " (" + CurACFund + "+" + CurCalculate.ACGained + "-" + (CurCalculate.TotalAC + CurCalculate.BombardAC) + ")"
   );
  }
  if(CurBombard == "ON" && CurCalculate.BombardTPoses == 0){
    result.html(
      "</br>Days Left to Onyx: " + CurCalculate.Days +
      "</br>Total AC Spent(Daily Transposes): " + CurCalculate.TotalAC +
      "</br>Total Tranpose Count (Daily Transposes): " + CurCalculate.TotalTPoses +
      "</br>XP Pool by the end: " + CurCalculate.NewXPPool.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 
      "</br>ACs left by the end (Starting Fund + Daily Gains - Spent): " + CurCalculate.ACFund + " (" + CurACFund + "+" + CurCalculate.ACGained + "-" + CurCalculate.TotalAC + ")" +
      "</br>Can't Bombard with that amount of ACs."
   );
  }
  if(CurBombard == "OFF"){
    result.html(
      "</br>Days Left to Onyx: " + CurCalculate.Days +
      "</br>Total AC Spent(Daily Transposes): " + CurCalculate.TotalAC +
      "</br>Total Tranpose Count (Daily Transposes): " + CurCalculate.TotalTPoses +
      "</br>XP Pool by the end: " + CurCalculate.NewXPPool.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 
      "</br>ACs left by the end (Starting Fund + Daily Gains - Spent): " + CurCalculate.ACFund + " (" + CurACFund + "+" + CurCalculate.ACGained + "-" + CurCalculate.TotalAC + ")"
   );
  }
  if (calculated == false){
  suggestButton = createButton("Make Optimization Suggestion");
  suggestButton.mousePressed(SuggestButton);
  suggestResult = createP("")
  }
  calculated = true;

  suggestResult.html("");
}

function SuggestButton(){
  suggestCalculate();
  if (suggest.Days !== CurCalculate.Days){
  if (suggest.tPoseCount !== CurCalculate.tPoseCount && CurCalculate.Bombard !== "ON" && suggest.BombardTPoses > suggest.tPoseCount){
    suggestResult.html(
      "</br>Change Daily Transpose Count to: " + suggest.tPoseCount +
      "</br>Turn Bombard on the last day ON!" +
      "</br>These settings will enable you to get Onyx at day: " + suggest.Days +
      "</br>That is " + (CurCalculate.Days - suggest.Days) + " days earlier than your settings!"
    )
  }
  if (suggest.tPoseCount !== CurCalculate.tPoseCount && CurCalculate.Bombard !== "ON" && suggest.BombardTPoses == 0){
    suggestResult.html(
      "</br>Change Daily Transpose Count to: " + suggest.tPoseCount +
      "</br>No need to Bombard on the last day, you can keep that off." +
      "</br>These settings will enable you to get Onyx at day: " + suggest.Days +
      "</br>That is " + (CurCalculate.Days - suggest.Days) + " days earlier than your settings!"
    )
  }
  if (suggest.tPoseCount !== CurCalculate.tPoseCount && CurCalculate.Bombard == "ON" && suggest.BombardTPoses > suggest.tPoseCount){
    suggestResult.html(
      "</br>Change Daily Transpose Count to: " + suggest.tPoseCount +
      "</br>Keep Bombard ON, it helps you save time!" +
      "</br>These settings will enable you to get Onyx at day: " + suggest.Days +
      "</br>That is " + (CurCalculate.Days - suggest.Days) + " days earlier than your settings!"
    )
  }
  if (suggest.tPoseCount !== CurCalculate.tPoseCount && CurCalculate.Bombard == "ON" && suggest.BombardTPoses == 0){
    suggestResult.html(
      "</br>Change Daily Transpose Count to: " + suggest.tPoseCount +
      "</br>No need to Bombard on the last day, you can turn that off." +
      "</br>These settings will enable you to get Onyx at day: " + suggest.Days +
      "</br>That is " + (CurCalculate.Days - suggest.Days) + " days earlier than your settings!"
    )
  }

  if (suggest.tPoseCount == CurCalculate.tPoseCount && CurCalculate.Bombard !== "ON" && suggest.BombardTPoses > suggest.tPoseCount){
    suggestResult.html(
      "</br>Your Daily Transpose Count is already good, keep that the same." +
      "</br>Turn Bombard on the last day ON!" +
      "</br>These settings will enable you to get Onyx at day: " + suggest.Days +
      "</br>That is " + (CurCalculate.Days - suggest.Days) + " days earlier than your settings!"
    )
  }
  if (suggest.tPoseCount == CurCalculate.tPoseCount && CurCalculate.Bombard !== "ON" && suggest.BombardTPoses == 0){
    suggestResult.html(
      "</br>Your Daily Transpose Count is already good, keep that the same." +
      "</br>No need to Bombard on the last day, you can keep that off." +
      "</br>In summary, your settings are perfect!"
    )
  }
  if (suggest.tPoseCount == CurCalculate.tPoseCount && CurCalculate.Bombard == "ON" && suggest.BombardTPoses > suggest.tPoseCount){
    suggestResult.html(
      "</br>Your Daily Transpose Count is already good, keep that the same." +
      "</br>Keep Bombard ON, it helps you save time!" +
      "</br>In summary, your settings are perfect!"
    )
  }
  if (suggest.tPoseCount == CurCalculate.tPoseCount && CurCalculate.Bombard == "ON" && suggest.BombardTPoses == 0){
    suggestResult.html(
      "</br>Your Daily Transpose Count is already good, keep that the same." +
      "</br>No need to Bombard on the last day, you can turn that off." +
      "</br>In summary, your settings are almost perfect, just no need to Bombard!"
    )
  }
}

if (suggest.Days == CurCalculate.Days){
  if (suggest.tPoseCount !== CurCalculate.tPoseCount && CurCalculate.Bombard !== "ON" && suggest.BombardTPoses > suggest.tPoseCount){
    suggestResult.html(
      "</br>Change Daily Transpose Count to: " + suggest.tPoseCount +
      "</br>Turn Bombard on the last day ON!" +
      "</br>These settings will enable you to get Onyx at the same day but may save some ACs."
    )
  }
  if (suggest.tPoseCount !== CurCalculate.tPoseCount && CurCalculate.Bombard !== "ON" && suggest.BombardTPoses == 0){
    suggestResult.html(
      "</br>Change Daily Transpose Count to: " + suggest.tPoseCount +
      "</br>No need to Bombard on the last day, you can keep that off." +
      "</br>These settings will enable you to get Onyx at the same day but may save some ACs."
    )
  }
  if (suggest.tPoseCount !== CurCalculate.tPoseCount && CurCalculate.Bombard == "ON" && suggest.BombardTPoses > suggest.tPoseCount){
    suggestResult.html(
      "</br>Change Daily Transpose Count to: " + suggest.tPoseCount +
      "</br>Keep Bombard ON, it helps you save time!" +
      "</br>These settings will enable you to get Onyx at the same day but may save some ACs."
    )
  }
  if (suggest.tPoseCount !== CurCalculate.tPoseCount && CurCalculate.Bombard == "ON" && suggest.BombardTPoses == 0){
    suggestResult.html(
      "</br>Change Daily Transpose Count to: " + suggest.tPoseCount +
      "</br>No need to Bombard on the last day, you can turn that off." +
      "</br>These settings will enable you to get Onyx at the same day but may save some ACs."
    )
  }

  if (suggest.tPoseCount == CurCalculate.tPoseCount && CurCalculate.Bombard !== "ON" && suggest.BombardTPoses > suggest.tPoseCount){
    suggestResult.html(
      "</br>Your Daily Transpose Count is already good, keep that the same." +
      "</br>Turn Bombard on the last day ON!" +
      "</br>These settings will enable you to get Onyx at the same day but may save some ACs."
    )
  }
  if (suggest.tPoseCount == CurCalculate.tPoseCount && CurCalculate.Bombard !== "ON" && suggest.BombardTPoses == 0){
    suggestResult.html(
      "</br>Your Daily Transpose Count is already good, keep that the same." +
      "</br>No need to Bombard on the last day, you can keep that off." +
      "</br>In summary, your settings are perfect!"
    )
  }
  if (suggest.tPoseCount == CurCalculate.tPoseCount && CurCalculate.Bombard == "ON" && suggest.BombardTPoses > suggest.tPoseCount){
    suggestResult.html(
      "</br>Your Daily Transpose Count is already good, keep that the same." +
      "</br>Keep Bombard ON, it helps you save time!" +
      "</br>In summary, your settings are perfect!"
    )
  }
  if (suggest.tPoseCount == CurCalculate.tPoseCount && CurCalculate.Bombard == "ON" && suggest.BombardTPoses == 0){
    suggestResult.html(
      "</br>Your Daily Transpose Count is already good, keep that the same." +
      "</br>No need to Bombard on the last day, you can turn that off." +
      "</br>In summary, your settings are almost perfect, just no need to Bombard!"
    )
  }
}
}

function CurCTFarmingInputChanged() {
  if (this.checked()) {
    CurCTFarming = "ON";
  } else {
    CurCTFarming = "OFF";
  }
}

function CurCTTposeInputChanged() {
  if (this.checked()) {
    CurCTTpose = "ON";
  } else {
    CurCTTpose = "OFF";
  }
}

function CurBombardInputChanged() {
  if (this.checked()) {
    CurBombard = "ON";
  } else {
    CurBombard = "OFF";
  }
}

function suggestCalculate() {
  let minDay = 1000000;
  let dailytp = 0;
  for (let i = 0; i < 25; i++) {
    suggest = new Calculate(
      i,
      CurXPPool,
      CurGearXP,
      CurDailyXP,
      CurACFund,
      CurACGain,
      CurCTFarming,
      CurCTTpose,
      "ON"
    );
    suggest.calc();
    if (suggest.Days < minDay) {
      minDay = suggest.Days;
      dailytp = i;
    }
  }
  suggest = new Calculate(
    dailytp,
    CurXPPool,
    CurGearXP,
    CurDailyXP,
    CurACFund,
    CurACGain,
    CurCTFarming,
    CurCTTpose,
    "ON"
  );
  suggest.calc();
}











class Calculate {
  constructor(
    tPoseCount,
    XPPool,
    GearXP,
    DailyXP,
    ACFund,
    DailyAC,
    CtapperFarming,
    CtapperTpose,
    Bombard
  ) {
    this.tPoseCount = tPoseCount;
    this.XPPool = XPPool;
    this.GearXP = GearXP;
    this.DailyXP = DailyXP;
    this.NewXPPool = XPPool;
    this.NewGearXP = GearXP;
    this.ACFund = ACFund;
    this.DailyAC = DailyAC;
    this.CtapperFarming = CtapperFarming;
    this.CtapperTpose = CtapperTpose;
    this.Bombard = Bombard;
    this.Days = 0;
    this.TotalTPoses = 0;
    this.BombardTPoses = 0;
    this.TotalAC = 0;
    this.BombardAC = 0;
    this.ACGained = 0;
  }

  tPose() {
    let XPGain;
    if (this.CtapperTpose == "ON") {
      XPGain = round((this.NewXPPool * (1 - 0.99)) / 4444);
    } else {
      XPGain = round((this.NewXPPool * (1 - 0.99)) / 8888);
    }
    let XPLeft = round(this.NewXPPool * 0.99);
    this.NewGearXP += XPGain;
    this.NewXPPool = XPLeft;
  }

  grind() {
    let XPGain;
    if (this.CtapperFarming == "ON") {
      XPGain = round(this.DailyXP / 4444 / 8);
    } else {
      XPGain = round(this.DailyXP / 8888 / 8);
    }
    this.NewGearXP += XPGain;
    this.NewXPPool += this.DailyXP;
  }

  bombard() {
    let StoreNewXPPool = this.NewXPPool;
    let StoreNewGearXP = this.NewGearXP;
    let StoreACFund = this.ACFund;
    let StoreTotalTPoses = this.TotalTPoses;
    for (let i = 0; i < 100; i++) {
      if (this.NewGearXP < 2000000000 && this.ACFund > 10 * i) {
        this.tPose();
        this.BombardTPoses++;
        this.ACFund -= 10 * i;
        this.BombardAC += 10 * i;
      } else {
        break;
      }
    }
    if (this.NewGearXP < 2000000000) {
      this.NewXPPool = StoreNewXPPool;
      this.NewGearXP = StoreNewGearXP;
      this.ACFund = StoreACFund;
      this.TotalTPoses = StoreTotalTPoses;
      this.BombardTPoses = 0;
      this.BombardAC = 0;
    }
    if (this.NewGearXP > 2000000000 && this.BombardTPoses < this.tPoseCount + 1) {
      this.TotalTPoses += this.BombardTPoses;
      this.BombardTPoses = 0;
    }
  }

  update() {
    if (this.NewGearXP < 2000000000) {
      this.grind();
    }
    if (this.Bombard == "ON") {
      this.bombard();
    }
    if (this.NewGearXP < 2000000000) {
      this.ACGained += CurACGain;
      this.ACFund += CurACGain;
      for (let i = 0; i < this.tPoseCount; i++) {
        if (this.NewGearXP < 2000000000 && this.ACFund > 10 * i) {
          this.tPose();
          this.TotalTPoses++;
          this.ACFund -= 10 * i;
          this.TotalAC += 10 * i;
        } else {
          break;
        }
      }
    }
    if (this.NewGearXP < 2000000000) {
      this.Days++;
    }
  }

  calc() {
    while (this.NewGearXP < 2000000000) {
      this.update();
    }
  }
}
