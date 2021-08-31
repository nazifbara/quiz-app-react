import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";



export declare class QuizItem {
  readonly category: string;
  readonly type: string;
  readonly difficulty: string;
  readonly question: string;
  readonly incorrect_answers?: string[];
  readonly correct_answer: string;
  readonly answers?: string[];
  constructor(init: ModelInit<QuizItem>);
}

export declare class Quiz {
  readonly id: string;
  readonly name: string;
  readonly items?: QuizItem[];
  readonly owner: string;
  constructor(init: ModelInit<Quiz>);
  static copyOf(source: Quiz, mutator: (draft: MutableModel<Quiz>) => MutableModel<Quiz> | void): Quiz;
}