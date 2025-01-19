/**
* * Timer job types
*/
enum FlexTimerType {
  // Run at exact time
  RUN_AT = "run_at",
  // Run in N milliseconds
  RUN_IN = "run_in",
  // Run every N milliseconds
  RUN_EVERY = "run_every"
}
/**
* * Flex Timer class
*/
class FlexTimer {
  // Constant max duration of NodeJS timer, ms
  private maxDelayTime: number = Math.pow(2, 31) - 1;
  // Timer parameters
  private readonly type: FlexTimerType;
  private readonly value: number;
  private readonly callback: Function;
  private readonly params: any;
  private overrideParams: any;
  // Current timeout
  private currentTimeout?: NodeJS.Timeout;
  // Timer stop request flag
  private stopRequestFlag: boolean = false;
  // Timer is active flag
  public isActive: boolean = false;
  // Interval value (for RUN_EVERY type)
  private interval?: number;
  
  /**
  * * Class constructor
  * @param type defining type of Timer
  * @param value defining value according to type: 
  * @param callback function to call on timer end
  * @param params to be passed with callback
  */
  constructor(type: FlexTimerType, value: number, callback: Function, params?: any) {
    this.type = type;
    this.value = value;
    this.callback = callback;
    this.params = params;
  }
  /**
  * * Timer start function
  */
  public start(params?: any) {
    if (params) this.overrideParams = params;
    this.stopRequestFlag = false;
    let runDelay: number;
    switch (this.type) {
      case FlexTimerType.RUN_IN:
        runDelay = this.value;
        break;
      case FlexTimerType.RUN_AT:
        runDelay = this.value - Date.now();
        if (runDelay < 0) runDelay = 0;
        break;
      case FlexTimerType.RUN_EVERY:
        runDelay = this.value;
        this.interval = this.value;
        break;
    }
    this.delayCycle(runDelay);
  }
  /**
  * * Timer stop function
  */
  public stop() {
    if (this.currentTimeout) {
      this.overrideParams = undefined;
      this.stopRequestFlag = true;
      clearTimeout(this.currentTimeout);
      this.isActive = false;
    }
  }
  /**
  * * Main delay cycle. Used to wait `maxDelayTime` blocks. If `delayLeft` less than `maxDelayTime` will call `finalCycle`
  * @param delayLeft time left for delay
  */
  private delayCycle(delayLeft: number) {
    this.isActive = true;
    // If delay time less than `maxDelayTime` - call `finalCycle`
    if (delayLeft < this.maxDelayTime) {
      this.finalCycle(delayLeft);
      return;
    }
    // Run intermediate delay
    this.currentTimeout = setTimeout(() => {
      this.delayCycle(delayLeft - this.maxDelayTime)
    }, this.maxDelayTime);
  }
  /**
  * * Final delay cycle. On timeout it will call callback function
  * @param delayLeft time left for delay
  */
  private finalCycle(delayLeft: number) {
    this.currentTimeout = setTimeout(() => {
      // Prevent callback when clearTimeout
      if (!this.stopRequestFlag) {
        if (this.overrideParams) {
          this.callback(this.overrideParams);
        } else {
          this.callback(this.params);
        }
        this.isActive = false;
        // If interval defined, restart delay cycle
        if (this.interval) this.delayCycle(this.interval);
        else this.overrideParams = undefined;
      }
    }, delayLeft);
  }
}

export { FlexTimerType, FlexTimer };