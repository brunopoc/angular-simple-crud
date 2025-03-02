import { createReducer, on } from '@ngrx/store';
import * as CategoryActions from './category.actions';
import { Category } from '../models/category.model';

export interface CategoryState {
  categories: Category[];
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  error: null
};

export const categoryReducer = createReducer(
  initialState,
  on(CategoryActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state, categories
  })),
  on(CategoryActions.loadCategoriesFailure, (state, { error }) => ({
    ...state, error
  }))
);
