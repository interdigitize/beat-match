import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

class App extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
    };
    this.count = this.count.bind(this);
    this.increment = this.increment.bind(this);
    this.startListening = this.startListening.bind(this);
    this.noteClickTime = this.noteClickTime.bind(this);
    this.reset = this.reset.bind(this);
    this.timeInterval = [];
    this.runClock = false;
    this.clock = 0;
    this.clicksLeft = 9;
    this.bpm = null;
    this.counter;

}
  increment() {
    if(this.runClock){
      this.clock = this.clock + 1;
    }
  }
  count() {
    clearInterval(this.counter);
    this.counter = setInterval(this.increment, 10);
  }

  startListening() {
    if (this.runClock === false) {
      this.timeInterval = [];
      this.runClock = true;
      this.bpm = null;
      this.count();
      this.updateClickCount();
    }
  }
  markTheBeat() {
    this.timeInterval.push(this.clock);
  }
  noteClickTime() {
    if(this.runClock === false) {
    } else if (this.timeInterval.length > 6) {
      this.markTheBeat();
      this.updateClickCount();
      this.runClock = false;
      this.clock = 0;
      this.calculateBPM(this.timeInterval);
    } else {
      this.markTheBeat();
      this.updateClickCount();
      this.clock = 0;
    }
  }
  updateClickCount() {
    this.clicksLeft--;
    $('#clickCount').html('clicks left' + '\n' + this.clicksLeft);
  }

  reset(){
    this.timeInterval = [];
    this.runClock = false;
    this.clock = 0;
    this.clicksLeft = 9;
    this.bpm = null;
  }


  calculateBPM(intervalArr) {
    this.timeInterval.shift();
    this.timeInterval.push(intervalArr[intervalArr.length - 1]);
    var totalTime8beats = intervalArr.reduce((sum, interval) => sum
      + interval);
    var bpm = Math.floor(60000 / ((totalTime8beats * 10) / 8));
    var intervalAverage = totalTime8beats / 8;
    var inAverageRange = this.timeInterval.filter(interval => {
      return interval < (intervalAverage + 10) &&
      interval > (intervalAverage - 10);
    });
    if (inAverageRange.length === 8) {
      $('#clickCount').text(bpm + ' bpm');
    } else {
      $('#clickCount').text('That was some nice clicking, but a little too creative to get a pulse. Please try again.');
    }
    this.reset();
  }

  render () {
    return (
      <div >
        <button onClick={this.startListening}>Set the Beat</button>
        <div onClick={this.noteClickTime} id="clickCount">{this.clicksLeft}</div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
