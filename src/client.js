import axios from 'axios';

const traviaApiURL = 'https://opentdb.com/api.php?amount=8&type=multiple';

export const fetchQuiz = async () => {
  const {
    data: { results },
  } = await axios.get(traviaApiURL);
  return results;
};

const client = {
  fetchQuiz,
};

export default client;
