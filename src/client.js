import axios from 'axios';
import { DataStore } from '@aws-amplify/datastore';
import { Quiz } from './models';

const traviaApi = 'https://opentdb.com/';
const ax = axios.create({
  baseURL: traviaApi,
  timeout: 2000,
});

export const getQuizByID = async (id) => await DataStore.query(Quiz, id);

export const getSavedQuizzes = async () => await DataStore.query(Quiz);

export const getQuiz = async (queryString) => {
  const {
    data: { results },
  } = await ax.get(`api.php?type=multiple&${queryString}`);
  return results;
};

export const getCategories = async () => {
  const {
    data: { trivia_categories },
  } = await ax.get('api_category.php');
  return trivia_categories;
};

export const saveQuiz = async (quiz) => await DataStore.save(new Quiz(quiz));

const client = {
  getQuizByID,
  getSavedQuizzes,
  saveQuiz,
  getQuiz,
  getCategories,
};

export default client;
