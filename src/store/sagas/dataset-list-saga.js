import { takeEvery } from 'redux-saga/effects'
import { DATASET_SEARCH, datasetSearchSucceeded, displayError } from '../actions'
import apiInvoker from './api-invoker'

export default function * theRealDatasetSaga () {
  yield takeEvery(
    DATASET_SEARCH,
    apiInvoker(
      {
        endpoint: '/api/v1/dataset/search',
        actionator: datasetSearchSucceeded,
        queryParameterBuilder: queryParamBuilder
      }
    )
  )
}

const queryParamBuilder = action => {
  const limit = 10
  const offset = (action.value.page - 1) * limit;

  return {
    offset: offset,
    limit: limit,
    sort: action.value.sortOrder,
    query: action.value.searchText,
    facets: action.value.facets,
    apiAccessible: action.value.apiAccessible
  }
}
