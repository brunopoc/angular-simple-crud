import { ActionReducerMap } from '@ngrx/store';
import { categoryReducer, CategoryState } from './category.reducer';

export interface AppState {
  categories: CategoryState;
}

export const reducers: ActionReducerMap<AppState> = {
  categories: categoryReducer
};
