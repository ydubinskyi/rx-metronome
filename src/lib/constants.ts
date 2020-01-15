export const initState = {
  beatsPerBar: 4,
  beatsPerMinute: 164,
  counter: 0,
  isTicking: false,
};

export const MIN_TEMPO_VALUE = 10;
export const MAX_TEMPO_VALUE = 300;

export const tempoTerms = [
  {
    from: 0,
    to: 20,
    name: 'Larghissimo',
  },
  {
    from: 20,
    to: 45,
    name: 'Grave',
  },
  {
    from: 40,
    to: 60,
    name: 'Largo',
  },
  {
    from: 45,
    to: 60,
    name: 'Lento',
  },
  {
    from: 60,
    to: 66,
    name: 'Larghetto',
  },
  {
    from: 66,
    to: 76,
    name: 'Adagio',
  },
  {
    from: 70,
    to: 80,
    name: 'Adagietto',
  },
  {
    from: 77,
    to: 108,
    name: 'Andante',
  },
  {
    from: 80,
    to: 108,
    name: 'Andantino',
  },
  {
    from: 92,
    to: 112,
    name: 'Andante moderato',
  },
  {
    from: 108,
    to: 120,
    name: 'Moderato',
  },
  {
    from: 116,
    to: 120,
    name: 'Allegro moderato',
  },
  {
    from: 120,
    to: 156,
    name: 'Allegro',
  },
  {
    from: 156,
    to: 176,
    name: 'Vivace',
  },
  {
    from: 172,
    to: 176,
    name: 'Vivacissimo',
  },
  {
    from: 168,
    to: 200,
    name: 'Presto',
  },
  {
    from: 200,
    to: 300,
    name: 'Prestissimo',
  },
];
