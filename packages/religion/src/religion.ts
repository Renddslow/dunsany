export interface Religion {
  pantheonID: string;
  rituals: Array<Ritual>;
  prohibitions: Array<Prohibition>;
  focus: 'piety' | 'charity' | 'chastity' | 'apotheosis' | 'paradise' | 'wisdom'; //  TODO: add to this list
  patrons: Array<string>; // Array<deity.id>
  classes: Array<ReligiousClass>;
  structure: Polity; // TODO: add to this list
}

interface Regularity {
  irregular: boolean;
  unit?: 'years' | 'months' | 'weeks' | 'days' | 'hours';
  value?: number;
}

interface Ritual {
  category: 'sacrifice' | 'practice' | 'prayer' | 'worship' | 'feast'; // TODO: add to this list
  name: string;
  importance: 'high' | 'medium' | 'low' | 'none';
  regularity: Regularity;
  perceivedWeight: number;
  actualWeight: number;
}

interface Prohibition {
  category: 'venal' | 'mortal';
  name: string;
  importance: 'high' | 'medium' | 'low' | 'none';
  perceivedWeight: number;
  actualWeight: number;
}

type ReligiousClassType = 'priest' | 'shaman' | 'scholar' | 'layman' | 'elder' | 'teacher'; // TODO: this

interface ReligiousClass {
  type: ReligiousClassType;
  education: {
    required: boolean;
    years: number;
  };
  perceivedWeight: number;
  actualWeight: number;
  authorityOver?: ReligiousClassType;
}

interface Polity {
  name: string;
  plurality: boolean;
  hierarchy: Array<ReligiousClass>; // 0 being lowest, Array.length - 1 being highest
}
