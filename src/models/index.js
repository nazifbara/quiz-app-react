// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Quiz, QuizItem } = initSchema(schema);

export {
  Quiz,
  QuizItem
};