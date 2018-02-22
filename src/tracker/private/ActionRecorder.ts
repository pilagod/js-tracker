/// <reference path='../public/types/SourceLocation.d.ts'/>
/// <reference path='./types/ActionData.d.ts'/>

import Brokers from './ActionRecorderBrokers'

interface Recorder extends
  RecorderFunctioner,
  RecorderController { }

interface RecorderController {
  startRecording(context: SourceLocation): void;
  stopRecording(context: SourceLocation): void;
  startBlocking(): void;
  stopBlocking(): void;
  isBlocking(): boolean;
  isRecording(): boolean;
  getRecordContext(): SourceLocation;
}

interface RecorderFunctioner {
  add(data: ActionAddData): void;
}

type RecorderBrokers = {
  'adder': new () => Broker
}

interface Broker {
  flush(context: SourceLocation): void;
  process(data: ActionData): void;
}

class ActionRecorder implements Recorder {

  private block: boolean = false
  private brokers: { [role: string]: Broker } = {}
  private context: SourceLocation = null

  constructor(brokers: RecorderBrokers) {
    for (const broker of Object.keys(brokers)) {
      this.brokers[broker] = new brokers[broker]()
    }
  }

  /* controller */

  public isBlocking() {
    return this.block
  }

  public isRecording() {
    return !!this.context
  }

  public getRecordContext() {
    return this.context
  }

  public startRecording(context: SourceLocation) {
    if (!this.context) {
      this.context = context
    }
  }

  public stopRecording(context: SourceLocation) {
    if (this.context === context) {
      this.flush(this.context)
      this.context = null
    }
  }

  public startBlocking() {
    this.block = true
  }

  public stopBlocking() {
    this.block = false
  }

  /* functioner */

  public add(data: ActionAddData) {
    this.brokers.adder.process(data)
  }

  /* private */

  private flush(context: SourceLocation) {
    for (const broker of Object.keys(this.brokers)) {
      this.brokers[broker].flush(context)
    }
  }
}

interface RecorderSnaphotter {
  saveSnapshot(): void;
  restoreSnapshot(): void;
}

class ActionRecorderMaster implements Recorder, RecorderSnaphotter {

  private recorder: Recorder
  private snapshots: Recorder[] = []

  constructor(
    private Recorder: new (Brokers: RecorderBrokers) => Recorder,
    private Brokers: RecorderBrokers
  ) {
    this.initRecorder()
  }

  /* controller */

  public isBlocking() {
    return this.recorder.isBlocking()
  }

  public isRecording() {
    return this.recorder.isRecording()
  }

  public getRecordContext() {
    return this.recorder.getRecordContext()
  }

  public startRecording(context: SourceLocation) {
    this.recorder.startRecording(context)
  }

  public stopRecording(context: SourceLocation) {
    this.recorder.stopRecording(context)
  }

  public startBlocking() {
    this.recorder.startBlocking()
  }

  public stopBlocking() {
    this.recorder.stopBlocking()
  }

  public saveSnapshot() {
    this.snapshots.push(this.recorder)
    this.initRecorder()
  }

  public restoreSnapshot() {
    this.recorder = this.snapshots.pop()
  }

  /* functioner */

  public add(data: ActionAddData) {
    this.recorder.add(data)
  }

  /* private */

  private initRecorder() {
    this.recorder = new this.Recorder(this.Brokers)
  }
}
export default new ActionRecorderMaster(ActionRecorder, Brokers)
export { Broker }