export interface ProducersStateItem {
  id: string;
  deviceLabel?: string;
  type?: 'front' | 'back' | 'share';
  paused: boolean;
  track: MediaStreamTrack;
  codec: string;
  rtpParameters?: {};
  score: { ssrc: number; score: number }[];
}

export interface ProducersStateType {
  [producerId: string]: ProducersStateItem;
}
