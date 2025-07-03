import mockChallenges from '@/services/mockData/challengeVoting.json';

// Mock data storage
let challenges = [...mockChallenges];
let nextId = Math.max(...challenges.map(c => c.Id)) + 1;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const challengeVotingService = {
  async getAll() {
    await delay(300);
    return [...challenges];
  },

  async getById(id) {
    await delay(300);
    const challenge = challenges.find(c => c.Id === parseInt(id));
    return challenge ? { ...challenge } : null;
  },

  async create(challengeData) {
    await delay(300);
    const newChallenge = {
      Id: nextId++,
      ...challengeData,
      votes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    challenges.push(newChallenge);
    return { ...newChallenge };
  },

  async update(id, challengeData) {
    await delay(300);
    const index = challenges.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Challenge not found');
    }
    
    const updatedChallenge = {
      ...challenges[index],
      ...challengeData,
      Id: parseInt(id), // Ensure ID remains unchanged
      updatedAt: new Date().toISOString()
    };
    
    challenges[index] = updatedChallenge;
    return { ...updatedChallenge };
  },

  async delete(id) {
    await delay(300);
    const index = challenges.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Challenge not found');
    }
    
    challenges.splice(index, 1);
    return true;
  },

  async getActiveChallenge() {
    await delay(300);
    const activeChallenge = challenges.find(c => c.status === 'active');
    return activeChallenge ? { ...activeChallenge } : null;
  },

  async getChallengesByStatus(status) {
    await delay(300);
    return challenges.filter(c => c.status === status).map(c => ({ ...c }));
  }
};