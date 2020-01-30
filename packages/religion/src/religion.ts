export interface Religion {
  id: string;
  pantheonID: string;
  rituals: Array<Ritual>;
  prohibitions: Array<Prohibition>;
  focus: 'piety' | 'charity' | 'chastity' | 'apotheosis' | 'paradise' | 'wisdom'; //  TODO: add to this list
  patrons: Array<string>; // Array<deity.id>
  classes: Array<ReligiousClass>;
  structure: Polity;
}

interface Regularity {
  irregular: boolean;
  unit?: 'years' | 'months' | 'weeks' | 'days' | 'hours';
  value?: number;
}

interface Ritual {
  id: string;
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
  id: string;
  type: ReligiousClassType;
  education: {
    required: boolean;
    years: number;
  };
  gender: 'male' | 'female';
  ageRange: [number, number];
  perceivedWeight: number;
  actualWeight: number;
  authorityOver?: ReligiousClassType;
  requirements: {
    celibacy: boolean;
    virginity: boolean;
  };
}

interface Polity {
  name: string;
  plurality: boolean;
  hierarchy: Array<string>; // 0 being lowest, Array.length - 1 being highest; ReligiousClass.id
}
