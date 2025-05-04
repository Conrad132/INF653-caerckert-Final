const State = require('../model/States');
const statesData = require('../model/statesData.json');

// get full state data with funfacts from MongoDB (if any)
const getMergedStateData = async () => {
  const dbStates = await State.find();
  const dbMap = new Map(dbStates.map(s => [s.stateCode, s.funfacts]));

  return statesData.map(state => {
    const funfacts = dbMap.get(state.code);
    return funfacts ? { ...state, funfacts } : state;
  });
};

// find one state by code
const findState = async (code) => {
  const state = statesData.find(st => st.code === code.toUpperCase());
  if (!state) return null;

  const dbState = await State.findOne({ stateCode: code.toUpperCase() });
  return dbState ? { ...state, funfacts: dbState.funfacts } : state;
};

const getAllStates = async (req, res) => {
  let states = await getMergedStateData();

  if (req.query.contig === 'true') {
    states = states.filter(state => state.code !== 'AK' && state.code !== 'HI');
  } else if (req.query.contig === 'false') {
    states = states.filter(state => state.code === 'AK' || state.code === 'HI');
  }

  res.json(states);
};

const getState = async (req, res) => {
  const state = await findState(req.params.state);
  if (!state) return res.status(404).json({ message: 'Invalid state abbreviation parameter' });

  res.json(state);
};

const getRandomFunFact = async (req, res) => {
  const stateCode = req.params.state.toUpperCase();

  const state = statesData.find(st => st.code === stateCode);
  if (!state) return res.status(404).json({ message: 'Invalid state abbreviation parameter' });

  const dbState = await State.findOne({ stateCode });
  if (!dbState || !dbState.funfacts?.length) {
    return res.status(404).json({ message: `No Fun Facts found for ${state.state}` });
  }

  const randomFact = dbState.funfacts[Math.floor(Math.random() * dbState.funfacts.length)];
  res.json({ funfact: randomFact });
};

// Individual Field Endpoints
const getCapital = async (req, res) => {
  const state = statesData.find(st => st.code === req.params.state.toUpperCase());
  if (!state) return res.status(404).json({ message: 'Invalid state abbreviation parameter' });

  res.json({ state: state.state, capital: state.capital_city });
};

const getNickname = async (req, res) => {
  const state = statesData.find(st => st.code === req.params.state.toUpperCase());
  if (!state) return res.status(404).json({ message: 'Invalid state abbreviation parameter' });

  res.json({ state: state.state, nickname: state.nickname });
};

const getPopulation = async (req, res) => {
  const state = statesData.find(st => st.code === req.params.state.toUpperCase());
  if (!state) return res.status(404).json({ message: 'Invalid state abbreviation parameter' });

  res.json({ state: state.state, population: Number(state.population).toLocaleString('en-US') });
};

const getAdmission = async (req, res) => {
  const state = statesData.find(st => st.code === req.params.state.toUpperCase());
  if (!state) return res.status(404).json({ message: 'Invalid state abbreviation parameter' });

  res.json({ state: state.state, admitted: state.admission_date });
};

// POST: Add new fun facts
const createFunFact = async (req, res) => {
  const stateCode = req.params.state.toUpperCase();
  const funfacts = req.body.funfacts;

  if (!funfacts || !Array.isArray(funfacts)) {
    return res.status(400).json({ message: 'State fun facts value must be an array' });
  }

  let dbState = await State.findOne({ stateCode });

  if (dbState) {
    dbState.funfacts.push(...funfacts);
    await dbState.save();
    return res.json(dbState);
  } else {
    dbState = await State.create({ stateCode, funfacts });
    return res.status(201).json(dbState);
  }
};

// PUT: Update specific fun fact
const updateFunFact = async (req, res) => {
  const { index, funfact } = req.body;
  const stateCode = req.params.state.toUpperCase();

  if (index === undefined || !funfact) {
    return res.status(400).json({ message: 'State fun facts value required' });
  }

  const dbState = await State.findOne({ stateCode });
  if (!dbState || !dbState.funfacts?.length) {
    const stateInfo = statesData.find(st => st.code === stateCode);
    return res.status(404).json({ message: `No Fun Facts found for ${stateInfo?.state || stateCode}` });
  }

  const zeroIndex = index - 1;
  if (zeroIndex < 0 || zeroIndex >= dbState.funfacts.length) {
    const stateInfo = statesData.find(st => st.code === stateCode);
    return res.status(400).json({ message: `No Fun Facts found at that index for ${stateInfo?.state || stateCode}` });
  }

  dbState.funfacts[zeroIndex] = funfact;
  await dbState.save();
  res.json(dbState);
};

// DELETE: Remove a fun fact at given index
const deleteFunFact = async (req, res) => {
  const { index } = req.body;
  const stateCode = req.params.state.toUpperCase();

  if (index === undefined) {
    return res.status(400).json({ message: 'State fun fact index value required' });
  }

  const dbState = await State.findOne({ stateCode });
  if (!dbState || !dbState.funfacts?.length) {
    const stateInfo = statesData.find(st => st.code === stateCode);
    return res.status(404).json({ message: `No Fun Facts found for ${stateInfo?.state || stateCode}` });
  }

  const zeroIndex = index - 1;
  if (zeroIndex < 0 || zeroIndex >= dbState.funfacts.length) {
    const stateInfo = statesData.find(st => st.code === stateCode);
    return res.status(400).json({ message: `No Fun Facts found at that index for ${stateInfo?.state || stateCode}` });
  }

  dbState.funfacts.splice(zeroIndex, 1);
  await dbState.save();
  res.json(dbState);
};

module.exports = {
  getAllStates,
  getState,
  getRandomFunFact,
  getCapital,
  getNickname,
  getPopulation,
  getAdmission,
  createFunFact,
  updateFunFact,
  deleteFunFact
};