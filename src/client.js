import axios from 'axios';

const traviaApi = 'https://opentdb.com/';

export const fetchQuiz = async (queryString) => {
  const {
    data: { results },
  } = await axios.get(`${traviaApi}api.php?type=multiple&${queryString}`);
  return results;
};

export const fetchCategories = async () => {
  const {
    data: { trivia_categories },
  } = await axios.get(traviaApi + 'api_category.php');

  return trivia_categories;
};

const client = {
  fetchQuiz,
  fetchCategories,
};

export default client;
