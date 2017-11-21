import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

class App extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        btnDisabled: false,
        displayCount: false,
        clicksLeft: 9,
        displayBpm: false,
        bpm: null,
        btnClasses: '',

    };
    this.count = this.count.bind(this);
    this.increment = this.increment.bind(this);
    this.startListening = this.startListening.bind(this);
    this.noteClickTime = this.noteClickTime.bind(this);
    this.reset = this.reset.bind(this);
    this.timeInterval = [];
    this.runClock = false;
    this.clock = 0;
    this.counter;

}
  increment() {
    if (this.runClock) {
      this.clock = this.clock + 1;
    }
  }
  count() {
    clearInterval(this.counter);
    this.counter = setInterval(this.increment, 10);
  }

  startListening() {
    this.setState({
      displayCount: true,
      btnDisabled: true,
      bpm: null,
      displayBpm: false,
    });

    if (this.runClock === false) {
      this.timeInterval = [];
      this.runClock = true;
      this.setState({
        bpm: null
      })
      this.count();
      this.updateClickCount();
    }
  }
  markTheBeat() {
    this.timeInterval.push(this.clock);
  }
  noteClickTime() {
    if(this.runClock === false) {
    } else if (this.timeInterval.length > 7) {
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
    let numLeft = this.state.clicksLeft;
    this.setState({
      clicksLeft: --numLeft,
      btnClasses: 'flash'
    })
    // this.setState({
    //   btnClasses: ''
    // })
  }

  reset(){
    this.timeInterval = [];
    this.runClock = false;
    this.clock = 0;
    this.setState({
      btnDisabled: false,
      displayCount: false,
      clicksLeft: 9,
      bpm: null
    });
  }

  calculateBPM(intervalArr) {
    this.timeInterval.shift();
    this.timeInterval.shift();
    this.timeInterval.push(intervalArr[intervalArr.length - 1]);
    console.log('timeInterval:', this.timeInterval)
    var totalTime8beats = intervalArr.reduce((sum, interval) => sum
      + interval);
    var bpm = Math.floor(60000 / ((totalTime8beats * 10) / 8));
    var intervalAverage = totalTime8beats / 8;
    var inAverageRange = this.timeInterval.filter(interval => {
      return interval < (intervalAverage + 10) &&
      interval > (intervalAverage - 10);
    });
    if (inAverageRange.length === 8) {
      bpm += ' BPM';
    } else {
      bpm = 'Your clicking was a little too creative to set BPM. Try again.';
    }
    this.setState({
      displayBpm: true,
      bpm: bpm
    }, this.reset())

  }

  render () {
    if (this.state.btnDisabled) {
      console.log('clicksLeft', this.state.clicksLeft);
      $("#bigBtn").click(function() {
        $("#bigBtn").removeClass("flash");
        setTimeout(function() {
          $("#bigBtn").addClass("flash");
        }, 1);
      });
    } else {
      $( "#bigBtn").unbind( "click" );
    }

     return (
      <div onClick={this.noteClickTime} id='bigBtn'>
        <button onClick={this.startListening} id='setBeat' disabled={this.state.btnDisabled}>set the BEAT</button>
        {this.state.displayCount ? <div className="center"><div id="countDown" >{this.state.clicksLeft} <div style={{fontSize: '.08em'}}>CLICKS LEFT</div></div></div> : <div></div>}
        {this.state.displayBpm ? <div className="center"><div id='bpm' >{this.state.bpm}</div></div> : <div></div>}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
