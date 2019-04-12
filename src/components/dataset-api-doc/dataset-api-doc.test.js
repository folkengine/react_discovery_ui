import { shallow } from 'enzyme'
import DatasetApiDoc from './dataset-api-doc'

describe('data card element', () => {
  let subject

  test('the example url should have the dataset id', () => {
      subject = shallow(<DatasetApiDoc dataset={{ id: 'coda_stuff', name: "data_name", organization: {name: "coda_name"}}} />)
    expect(subject.find('.example-code').text()).toMatch('/api/v1/organization/coda_name/dataset/data_name/query?limit=200')
  })
})
